package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Submission;
import com.studenttracker.backend.service.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/submissions")
@CrossOrigin("*")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
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
        List<Submission> submissions = submissionService.getAllSubmissions();
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByStudent(@PathVariable Long studentId) {
        List<Submission> submissions = submissionService.getSubmissionsByStudentId(studentId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<Submission> submissions = submissionService.getSubmissionsByAssignmentId(assignmentId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/student/{studentId}/assignment/{assignmentId}")
    public ResponseEntity<Submission> getSubmissionByStudentAndAssignment(@PathVariable Long studentId,
            @PathVariable Long assignmentId) {
        Optional<Submission> submission = submissionService.getSubmissionByStudentAndAssignment(studentId,
                assignmentId);
        return submission.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Submission> updateSubmission(@PathVariable Long id,
            @RequestBody Submission submissionDetails) {
        Submission updatedSubmission = submissionService.updateSubmission(id, submissionDetails);
        return ResponseEntity.ok(updatedSubmission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }
}
