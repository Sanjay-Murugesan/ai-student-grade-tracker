package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.entity.Course;
import com.studenttracker.backend.repository.GradeRepository;
import com.studenttracker.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GradeService {

    private final GradeRepository repo;
    private final CourseRepository courseRepository;

    public GradeService(GradeRepository repo, CourseRepository courseRepository) {
        this.repo = repo;
        this.courseRepository = courseRepository;
    }

    /**
     * Saves a grade entity.
     * 
     * @param g the grade to save
     * @return the saved grade
     */
    public Grade save(Grade g) {
        if (g == null) {
            throw new IllegalArgumentException("Grade cannot be null");
        }
        applyGradeCalculation(g);
        Grade saved = repo.save(g);
        updateStudentGpaSnapshot(saved.getStudentId());
        return saved;
    }

    /**
     * Retrieves grades by student ID.
     * 
     * @param id the student ID
     * @return list of grades for the student
     */
    public List<Grade> getByStudent(Long id) {
        if (id == null) {
            return List.of();
        }
        return repo.findByStudentId(id);
    }

    /**
     * Retrieves grades by assignment ID.
     * 
     * @param id the assignment ID
     * @return list of grades for the assignment
     */
    public List<Grade> getByAssignment(Long id) {
        if (id == null) {
            return List.of();
        }
        return repo.findByAssignmentId(id);
    }

    public List<Grade> getByStudentAndSemester(Long studentId, Integer semester) {
        if (studentId == null || semester == null) {
            return List.of();
        }
        return repo.findByStudentIdAndSemester(studentId, semester);
    }

    /**
     * Creates a new grade.
     * 
     * @param grade the grade to create
     * @return the saved grade
     */
    public Grade createGrade(Grade grade) {
        return save(grade);
    }

    /**
     * Retrieves a grade by ID.
     * 
     * @param id the grade ID
     * @return the grade if found, null otherwise
     */
    public Grade getById(Long id) {
        if (id == null) {
            return null;
        }
        return repo.findById(id).orElse(null);
    }

    /**
     * Retrieves all grades.
     * 
     * @return list of all grades
     */
    public List<Grade> getAll() {
        return repo.findAll();
    }

    /**
     * Updates an existing grade.
     * 
     * @param id    the grade ID
     * @param grade the updated grade details
     * @return the updated grade, or null if not found
     */
    public Grade updateGrade(Long id, Grade grade) {
        if (id == null || grade == null) {
            return null;
        }
        Grade existing = getById(id);
        if (existing == null) {
            return null;
        }
        existing.setScore(grade.getScore());
        existing.setCourseId(grade.getCourseId());
        existing.setInternalMarks(grade.getInternalMarks());
        existing.setSemesterMarks(grade.getSemesterMarks());
        existing.setAssignmentMarks(grade.getAssignmentMarks());
        existing.setMarks(grade.getMarks());
        existing.setSemester(grade.getSemester());
        existing.setGrade(grade.getGrade());
        existing.setGradePoints(grade.getGradePoints());
        existing.setFeedback(grade.getFeedback());
        existing.setGradedBy(grade.getGradedBy());
        existing.setGradedAt(grade.getGradedAt());
        applyGradeCalculation(existing);
        Grade saved = repo.save(existing);
        updateStudentGpaSnapshot(saved.getStudentId());
        return saved;
    }

    /**
     * Deletes a grade by ID.
     * 
     * @param id the grade ID
     */
    public void deleteGrade(Long id) {
        if (id == null) {
            return;
        }
        repo.deleteById(id);
    }

    public Map<String, Object> calculateGpaSummary(Long studentId) {
        List<Grade> grades = getByStudent(studentId);
        double cgpa = calculateCgpa(grades);
        Map<Integer, Double> semesterGpas = grades.stream()
                .filter(g -> g.getSemester() != null)
                .collect(Collectors.groupingBy(
                        Grade::getSemester,
                        Collectors.collectingAndThen(Collectors.toList(), this::calculateGpa)));

        return Map.of(
                "studentId", studentId,
                "gpa", calculateGpa(grades),
                "cgpa", cgpa,
                "semesterGpas", semesterGpas);
    }

    private void applyGradeCalculation(Grade grade) {
        Double marks = firstNonNull(grade.getMarks(), grade.getScore());
        if (marks == null) {
            marks = weightedMarks(grade);
        }
        grade.setMarks(marks);
        grade.setScore(firstNonNull(grade.getScore(), marks));
        grade.setGrade(calculateLetterGrade(marks));
        grade.setGradePoints(calculateGradePoints(marks));
    }

    private Double weightedMarks(Grade grade) {
        double internal = NumberOrZero(grade.getInternalMarks());
        double semester = NumberOrZero(grade.getSemesterMarks());
        double assignment = NumberOrZero(grade.getAssignmentMarks());
        if (internal == 0 && semester == 0 && assignment == 0) {
            return 0.0;
        }
        return Math.min(100.0, (internal * 0.3) + (semester * 0.5) + (assignment * 0.2));
    }

    private String calculateLetterGrade(Double marks) {
        double value = NumberOrZero(marks);
        if (value >= 90) return "O";
        if (value >= 80) return "A+";
        if (value >= 70) return "A";
        if (value >= 60) return "B+";
        if (value >= 50) return "B";
        if (value >= 40) return "C";
        return "F";
    }

    private Double calculateGradePoints(Double marks) {
        double value = NumberOrZero(marks);
        if (value >= 90) return 10.0;
        if (value >= 80) return 9.0;
        if (value >= 70) return 8.0;
        if (value >= 60) return 7.0;
        if (value >= 50) return 6.0;
        if (value >= 40) return 5.0;
        return 0.0;
    }

    private Double calculateGpa(List<Grade> grades) {
        if (grades == null || grades.isEmpty()) return 0.0;
        Map<Long, Integer> creditsByCourse = courseRepository.findAll().stream()
                .filter(course -> course.getCourseId() != null)
                .collect(Collectors.toMap(Course::getCourseId, course -> course.getCredits() == null ? 1 : course.getCredits()));

        double weightedPoints = 0.0;
        double totalCredits = 0.0;
        for (Grade grade : grades) {
            int credits = grade.getCourseId() == null ? 1 : creditsByCourse.getOrDefault(grade.getCourseId(), 1);
            weightedPoints += NumberOrZero(grade.getGradePoints()) * credits;
            totalCredits += credits;
        }
        return totalCredits == 0 ? 0.0 : Math.round((weightedPoints / totalCredits) * 100.0) / 100.0;
    }

    private Double calculateCgpa(List<Grade> grades) {
        Map<Integer, List<Grade>> bySemester = grades.stream()
                .filter(grade -> grade.getSemester() != null)
                .collect(Collectors.groupingBy(Grade::getSemester));
        if (bySemester.isEmpty()) return calculateGpa(grades);
        double total = bySemester.values().stream().mapToDouble(this::calculateGpa).sum();
        return Math.round((total / bySemester.size()) * 100.0) / 100.0;
    }

    private void updateStudentGpaSnapshot(Long studentId) {
        // StudentService owns student updates; GPA summary endpoint exposes the calculated values.
    }

    private Double firstNonNull(Double first, Double second) {
        return first != null ? first : second;
    }

    private double NumberOrZero(Double value) {
        return value == null ? 0.0 : value;
    }
}
