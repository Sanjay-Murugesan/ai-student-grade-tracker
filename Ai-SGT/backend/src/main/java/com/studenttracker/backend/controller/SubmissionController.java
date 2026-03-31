package com.studenttracker.backend.controller;

import com.studenttracker.backend.dto.GradeSubmissionRequest;
import com.studenttracker.backend.dto.UngradedSubmissionDTO;
import com.studenttracker.backend.dto.UngradedSubmissionResponse;
import com.studenttracker.backend.entity.Assignment;
import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.Submission;
import com.studenttracker.backend.service.AssignmentService;
import com.studenttracker.backend.service.GradeService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.SubmissionService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/submissions", "/api/submissions"})
@CrossOrigin("*")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final StudentService studentService;
    private final AssignmentService assignmentService;
    private final GradeService gradeService;

    public SubmissionController(
            SubmissionService submissionService,
            StudentService studentService,
            AssignmentService assignmentService,
            GradeService gradeService) {
        this.submissionService = submissionService;
        this.studentService = studentService;
        this.assignmentService = assignmentService;
        this.gradeService = gradeService;
    }

    @PostMapping
    public ResponseEntity<Submission> createSubmission(@RequestBody Submission submission) {
        Submission createdSubmission = submissionService.createSubmission(submission);
        return ResponseEntity.ok(createdSubmission);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Long id) {
        Optional<Submission> submission = submissionService.getSubmissionById(id);
        return submission.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Submission>> getMySubmissions() {
        Student student = studentService.getByEmail(getPrincipalEmail())
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        return ResponseEntity.ok(submissionService.getSubmissionsByStudentId(student.getStudentId()));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudentId(studentId));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignmentId(assignmentId));
    }

    @GetMapping("/student/{studentId}/assignment/{assignmentId}")
    public ResponseEntity<Submission> getSubmissionByStudentAndAssignment(
            @PathVariable Long studentId,
            @PathVariable Long assignmentId) {
        Optional<Submission> submission = submissionService.getSubmissionByStudentAndAssignment(studentId, assignmentId);
        return submission.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/ungraded")
    public ResponseEntity<UngradedSubmissionResponse> getUngradedSubmissions() {
        List<UngradedSubmissionDTO> submissions = submissionService.getUngradedSubmissions().stream().map(submission -> {
            Assignment assignment = assignmentService.getById(submission.getAssignmentId());
            Student student = studentService.getById(submission.getStudentId());
            return new UngradedSubmissionDTO(
                    submission.getSubmissionId(),
                    submission.getAssignmentId(),
                    assignment == null ? "Assignment" : assignment.getTitle(),
                    submission.getStudentId(),
                    student == null ? "Student" : student.getName(),
                    submission.getStatus().name());
        }).toList();
        return ResponseEntity.ok(new UngradedSubmissionResponse(submissions.size(), submissions));
    }

    @PatchMapping("/{id}/grade")
    public ResponseEntity<Submission> gradeSubmission(@PathVariable Long id, @RequestBody GradeSubmissionRequest request) {
        Submission submission = submissionService.gradeSubmission(id, request);
        Assignment assignment = assignmentService.getById(submission.getAssignmentId());
        Grade grade = new Grade();
        grade.setStudentId(submission.getStudentId());
        grade.setAssignmentId(submission.getAssignmentId());
        grade.setCourseId(assignment == null ? null : assignment.getCourseId());
        grade.setScore(request.getScore());
        grade.setMaxScore(assignment == null || assignment.getMaxMarks() == null ? 100.0 : assignment.getMaxMarks().doubleValue());
        grade.setGradeType("ASSIGNMENT");
        grade.setFeedback(request.getFeedback());
        grade.setGradedAt(LocalDateTime.now());
        gradeService.save(grade);
        return ResponseEntity.ok(submission);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Submission> updateSubmission(@PathVariable Long id, @RequestBody Submission submissionDetails) {
        Submission updatedSubmission = submissionService.updateSubmission(id, submissionDetails);
        return ResponseEntity.ok(updatedSubmission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }

    private String getPrincipalEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? null : authentication.getName();
    }
}
