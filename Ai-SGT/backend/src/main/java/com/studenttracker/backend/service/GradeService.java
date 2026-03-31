package com.studenttracker.backend.service;

import com.studenttracker.backend.dto.BulkGradeRequest;
import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.repository.GradeRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GradeService {

    private final GradeRepository repo;

    public GradeService(GradeRepository repo) {
        this.repo = repo;
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
        return repo.save(g);
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
        existing.setFeedback(grade.getFeedback());
        existing.setGradedBy(grade.getGradedBy());
        existing.setGradedAt(grade.getGradedAt());
        return repo.save(existing);
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

    public List<Grade> getByCourse(Long courseId) {
        if (courseId == null) {
            return List.of();
        }
        return repo.findByCourseId(courseId);
    }

    @Transactional
    public List<Grade> saveBulkGrades(List<BulkGradeRequest> requests, Long gradedBy) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }
        List<Grade> grades = requests.stream().map(request -> {
            Grade grade = new Grade();
            grade.setStudentId(request.getStudentId());
            grade.setCourseId(request.getCourseId());
            grade.setAssignmentId(request.getAssignmentId());
            grade.setScore(request.getScore());
            grade.setMaxScore(request.getMaxScore() == null ? 100.0 : request.getMaxScore());
            grade.setGradeType(request.getGradeType());
            grade.setGradedBy(gradedBy);
            grade.setGradedAt(LocalDateTime.now());
            return grade;
        }).toList();
        return repo.saveAll(grades);
    }
}
