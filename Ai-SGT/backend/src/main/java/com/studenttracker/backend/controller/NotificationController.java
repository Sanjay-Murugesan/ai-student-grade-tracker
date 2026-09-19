package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Notification;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.service.NotificationService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService notificationService;
    private final StudentService studentService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, StudentService studentService, UserService userService) {
        this.notificationService = notificationService;
        this.studentService = studentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Notification notification) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can create notifications");
        return ResponseEntity.ok(notificationService.save(notification));
    }

    @GetMapping
    public ResponseEntity<?> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can view all notifications");
        return ResponseEntity.ok(notificationService.getAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> byStudent(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long studentId) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (!canViewStudent(user.get(), studentId)) return forbidden("Students can only view their own notifications");
        return ResponseEntity.ok(notificationService.getByStudent(studentId));
    }

    private boolean canViewStudent(User user, Long studentId) {
        if (user.getRole() == UserRole.INSTRUCTOR) return true;
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
