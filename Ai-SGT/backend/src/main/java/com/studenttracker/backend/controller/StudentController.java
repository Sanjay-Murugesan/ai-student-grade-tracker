package com.studenttracker.backend.controller;

import com.studenttracker.backend.dto.StudentDashboardDTO;
import com.studenttracker.backend.dto.StudentRosterDTO;
import com.studenttracker.backend.entity.AiPrediction;
import com.studenttracker.backend.entity.Assignment;
import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.Submission;
import com.studenttracker.backend.entity.SubmissionStatus;
import com.studenttracker.backend.service.AiService;
import com.studenttracker.backend.service.AssignmentService;
import com.studenttracker.backend.service.GradeService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.SubmissionService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping({"/api/v1/students", "/api/students"})
@CrossOrigin("*")
public class StudentController {

    private final StudentService studentService;
    private final GradeService gradeService;
    private final AssignmentService assignmentService;
    private final SubmissionService submissionService;
    private final AiService aiService;

    public StudentController(
            StudentService studentService,
            GradeService gradeService,
            AssignmentService assignmentService,
            SubmissionService submissionService,
            AiService aiService) {
        this.studentService = studentService;
        this.gradeService = gradeService;
        this.assignmentService = assignmentService;
        this.submissionService = submissionService;
        this.aiService = aiService;
    }

    @PostMapping
    public Student add(@RequestBody Student student) {
        return studentService.save(student);
    }

    @GetMapping
    public List<Student> all() {
        return studentService.getAll();
    }

    @GetMapping("/{id}")
    public Student get(@PathVariable Long id) {
        return studentService.getById(id);
    }

    @GetMapping("/user/{userId}")
    public Student getByUserId(@PathVariable Long userId) {
        Optional<Student> student = studentService.getByUserId(userId);
        return student.orElse(null);
    }

    @GetMapping("/me")
    public ResponseEntity<Student> getCurrentStudent() {
        return ResponseEntity.ok(getAuthenticatedStudent());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard() {
        Student student = getAuthenticatedStudent();
        List<Grade> grades = gradeService.getByStudent(student.getStudentId());
        List<Assignment> assignments = assignmentService.getPublishedAssignments();
        List<Submission> submissions = submissionService.getSubmissionsByStudentId(student.getStudentId());
        int pendingAssignments = (int) assignments.stream()
                .filter(assignment -> submissions.stream().noneMatch(
                        submission -> submission.getAssignmentId().equals(assignment.getAssignmentId())
                                && submission.getStatus() != SubmissionStatus.PENDING))
                .count();
        double derivedGpa = grades.isEmpty()
                ? student.getGpa()
                : grades.stream()
                        .mapToDouble(grade -> ((grade.getScore() == null ? 0.0 : grade.getScore())
                                / (grade.getMaxScore() == null || grade.getMaxScore() == 0 ? 100.0 : grade.getMaxScore())) * 4.0)
                        .average()
                        .orElse(student.getGpa() == null ? 0.0 : student.getGpa());

        StudentDashboardDTO dto = new StudentDashboardDTO(
                student.getStudentId(),
                student.getName(),
                round(derivedGpa),
                student.getAttendancePercent() == null ? 0.0 : student.getAttendancePercent(),
                pendingAssignments,
                resolveRiskLevel(student, grades, submissions));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/roster")
    public ResponseEntity<List<StudentRosterDTO>> getStudentRoster() {
        List<Assignment> assignments = assignmentService.getPublishedAssignments();
        List<StudentRosterDTO> roster = studentService.getAll().stream().map(student -> {
            List<Grade> grades = gradeService.getByStudent(student.getStudentId());
            List<Submission> submissions = submissionService.getSubmissionsByStudentId(student.getStudentId());
            double submissionRate = assignments.isEmpty() ? 0.0 : ((double) submissions.size() / assignments.size()) * 100.0;
            AiPrediction prediction = fetchPrediction(student.getStudentId(), grades);
            String riskLevel = prediction != null && prediction.getRiskLevel() != null
                    ? prediction.getRiskLevel()
                    : resolveRiskLevel(student, grades, submissions);
            double riskScore = prediction != null && prediction.getPredictedScore() != null
                    ? prediction.getPredictedScore()
                    : 100.0 - (student.getGpa() == null ? 0.0 : student.getGpa() * 25.0);

            return new StudentRosterDTO(
                    student.getStudentId(),
                    student.getName(),
                    student.getEmail(),
                    student.getGpa(),
                    round(submissionRate),
                    riskLevel,
                    round(riskScore));
        }).toList();
        return ResponseEntity.ok(roster);
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student student) {
        return studentService.update(id, student);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        studentService.delete(id);
    }

    private Student getAuthenticatedStudent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException("No authenticated user");
        }
        return studentService.getByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Student profile not found"));
    }

    private String resolveRiskLevel(Student student, List<Grade> grades, List<Submission> submissions) {
        double average = grades.stream().mapToDouble(grade -> grade.getScore() == null ? 0.0 : grade.getScore()).average()
                .orElse(0.0);
        long lateCount = submissions.stream().filter(submission -> submission.getStatus() == SubmissionStatus.LATE).count();
        if (average < 50 || lateCount > 2 || (student.getAttendancePercent() != null && student.getAttendancePercent() < 60)) {
            return "HIGH";
        }
        if (average < 75 || lateCount > 0 || (student.getAttendancePercent() != null && student.getAttendancePercent() < 80)) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private AiPrediction fetchPrediction(Long studentId, List<Grade> grades) {
        try {
            if (grades.isEmpty()) {
                return aiService.getPrediction(studentId);
            }
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> payload = new HashMap<>();
            payload.put("studentId", studentId);
            payload.put("previousMarks", grades.stream().map(grade -> grade.getScore() == null ? 0.0 : grade.getScore()).toList());
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject("http://localhost:8000/predict", payload, Map.class);
            if (response == null) {
                return aiService.getPrediction(studentId);
            }
            Double predictionScore = response.get("prediction") instanceof Number number ? number.doubleValue() : null;
            AiPrediction prediction = new AiPrediction();
            prediction.setStudentId(studentId);
            prediction.setPredictedScore(predictionScore);
            prediction.setRiskLevel(predictionScore == null || predictionScore >= 75 ? "LOW"
                    : predictionScore >= 50 ? "MEDIUM" : "HIGH");
            prediction.setSuggestion("Follow up on recent assignment performance.");
            aiService.savePrediction(prediction);
            return prediction;
        } catch (Exception ex) {
            return aiService.getPrediction(studentId);
        }
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
