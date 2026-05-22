package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Submission;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.SubmissionService;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/submissions")
@CrossOrigin("*")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final StudentService studentService;
    private final UserService userService;

    public SubmissionController(
            SubmissionService submissionService,
            StudentService studentService,
            UserService userService) {

        this.submissionService = submissionService;
        this.studentService = studentService;
        this.userService = userService;
    }

    // Student creates submission
    @PostMapping
    public ResponseEntity<?> createSubmission(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Submission submission) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() == UserRole.STUDENT &&
                !ownsStudent(user.get(), submission.getStudentId())) {
            return forbidden("Students can only submit their own assignments");
        }

        try {
            Submission createdSubmission = submissionService.createSubmission(submission);
            return ResponseEntity.ok(createdSubmission);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Get submission by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        Optional<Submission> submission = submissionService.getSubmissionById(id);

        if (submission.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Submission not found"));
        }

        if (user.get().getRole() == UserRole.STUDENT &&
                !ownsStudent(user.get(), submission.get().getStudentId())) {
            return forbidden("Students can only view their own submissions");
        }

        return ResponseEntity.ok(submission.get());
    }

    // Instructor gets all submissions
    @GetMapping
    public ResponseEntity<?> getAllSubmissions(
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can view all submissions");
        }

        List<Submission> submissions = submissionService.getAllSubmissions();

        return ResponseEntity.ok(submissions);
    }

    // Get submissions by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getSubmissionsByStudent(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long studentId) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() == UserRole.STUDENT &&
                !ownsStudent(user.get(), studentId)) {
            return forbidden("Students can only view their own submissions");
        }

        List<Submission> submissions = submissionService.getSubmissionsByStudentId(studentId);

        return ResponseEntity.ok(submissions);
    }

    // Instructor gets all submissions for one assignment
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<?> getSubmissionsByAssignment(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long assignmentId) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can view assignment submissions");
        }

        List<Submission> submissions = submissionService.getSubmissionsByAssignmentId(assignmentId);

        return ResponseEntity.ok(submissions);
    }

    // Get one student's submission for one assignment
    @GetMapping("/student/{studentId}/assignment/{assignmentId}")
    public ResponseEntity<?> getSubmissionByStudentAndAssignment(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long studentId,
            @PathVariable Long assignmentId) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() == UserRole.STUDENT &&
                !ownsStudent(user.get(), studentId)) {
            return forbidden("Students can only view their own submissions");
        }

        Optional<Submission> submission =
                submissionService.getSubmissionByStudentAndAssignment(studentId, assignmentId);

        if (submission.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Submission not found"));
        }

        return ResponseEntity.ok(submission.get());
    }

    // Update submission
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubmission(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id,
            @RequestBody Submission submissionDetails) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        Optional<Submission> existing = submissionService.getSubmissionById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Submission not found"));
        }

        if (user.get().getRole() == UserRole.STUDENT &&
                !ownsStudent(user.get(), existing.get().getStudentId())) {
            return forbidden("Students can only update their own submissions");
        }

        // Student should not update marks/status
        if (user.get().getRole() == UserRole.STUDENT) {
            submissionDetails.setMarks(null);
            submissionDetails.setStatus("SUBMITTED");
        }

        try {
            Submission updatedSubmission = submissionService.updateSubmission(id, submissionDetails);
            return ResponseEntity.ok(updatedSubmission);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Instructor grades submission
    @PutMapping("/{id}/grade")
    public ResponseEntity<?> gradeSubmission(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id,
            @RequestBody Map<String, Double> body) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can grade submissions");
        }

        Double marks = body.get("marks");

        if (marks == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Marks are required"));
        }

        try {
            Submission gradedSubmission = submissionService.gradeSubmission(id, marks);
            return ResponseEntity.ok(gradedSubmission);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Instructor deletes submission
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can remove submissions");
        }

        Optional<Submission> existing = submissionService.getSubmissionById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Submission not found"));
        }

        submissionService.deleteSubmission(id);

        return ResponseEntity.noContent().build();
    }

    // Check whether logged-in user owns this student profile
    private boolean ownsStudent(User user, Long studentId) {
        Optional<Student> student = studentService.getByUserId(user.getId());
        return student.isPresent() && student.get().getStudentId().equals(studentId);
    }

    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Login required"));
    }

    private ResponseEntity<Map<String, String>> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", message));
    }
}