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

    public SubmissionController(SubmissionService submissionService, StudentService studentService, UserService userService) {
        this.submissionService = submissionService;
        this.studentService = studentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createSubmission(@RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Submission submission) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() == UserRole.STUDENT && !ownsStudent(user.get(), submission.getStudentId())) {
            return forbidden("Students can only submit their own assignments");
        }
        Submission createdSubmission = submissionService.createSubmission(submission);
        return ResponseEntity.ok(createdSubmission);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        Optional<Submission> submission = submissionService.getSubmissionById(id);
        if (submission.isEmpty()) return ResponseEntity.notFound().build();
        if (user.get().getRole() == UserRole.STUDENT && !ownsStudent(user.get(), submission.get().getStudentId())) {
            return forbidden("Students can only view their own submissions");
        }
        return ResponseEntity.ok(submission.get());
    }

    @GetMapping
    public ResponseEntity<?> getAllSubmissions(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can view all submissions");
        List<Submission> submissions = submissionService.getAllSubmissions();
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getSubmissionsByStudent(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long studentId) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() == UserRole.STUDENT && !ownsStudent(user.get(), studentId)) {
            return forbidden("Students can only view their own submissions");
        }
        List<Submission> submissions = submissionService.getSubmissionsByStudentId(studentId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<?> getSubmissionsByAssignment(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long assignmentId) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can view assignment submissions");
        List<Submission> submissions = submissionService.getSubmissionsByAssignmentId(assignmentId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/student/{studentId}/assignment/{assignmentId}")
    public ResponseEntity<?> getSubmissionByStudentAndAssignment(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long studentId,
            @PathVariable Long assignmentId) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() == UserRole.STUDENT && !ownsStudent(user.get(), studentId)) {
            return forbidden("Students can only view their own submissions");
        }
        Optional<Submission> submission = submissionService.getSubmissionByStudentAndAssignment(studentId,
                assignmentId);
        return submission.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubmission(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id,
            @RequestBody Submission submissionDetails) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        Optional<Submission> existing = submissionService.getSubmissionById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        if (user.get().getRole() == UserRole.STUDENT && !ownsStudent(user.get(), existing.get().getStudentId())) {
            return forbidden("Students can only update their own submissions");
        }
        if (user.get().getRole() == UserRole.STUDENT) {
            submissionDetails.setMarks(null);
            submissionDetails.setStatus("SUBMITTED");
        }
        Submission updatedSubmission = submissionService.updateSubmission(id, submissionDetails);
        return ResponseEntity.ok(updatedSubmission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can remove submissions");
        submissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }

    private boolean ownsStudent(User user, Long studentId) {
        Optional<Student> student = studentService.getByUserId(user.getId());
        return student.isPresent() && student.get().getStudentId().equals(studentId);
    }

    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
    }

    private ResponseEntity<Map<String, String>> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", message));
    }
}
