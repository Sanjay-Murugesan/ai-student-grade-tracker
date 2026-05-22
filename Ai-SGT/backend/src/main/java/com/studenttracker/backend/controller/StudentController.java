package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/students")
@CrossOrigin("*")
public class StudentController {

    private final StudentService service;
    private final UserService userService;

    public StudentController(StudentService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> add(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Student s) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can manage students");
        }

        return ResponseEntity.ok(service.save(s));
    }

    @GetMapping
    public ResponseEntity<?> all(
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can view all students");
        }

        List<Student> students = service.getAll();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        Student student = service.getById(id);

        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found"));
        }

        if (!canViewStudent(user.get(), student)) {
            return forbidden("Students can only view their own data");
        }

        return ResponseEntity.ok(student);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUserId(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long userId) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR &&
                !user.get().getId().equals(userId)) {
            return forbidden("Students can only view their own data");
        }

        Optional<Student> student = service.getByUserId(userId);

        if (student.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found"));
        }

        return ResponseEntity.ok(student.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id,
            @RequestBody Student s) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can manage students");
        }

        Student updated = service.update(id, s);

        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found"));
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {

        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);

        if (user.isEmpty()) {
            return unauthorized();
        }

        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can manage students");
        }

        Student existing = service.getById(id);

        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found"));
        }

        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    private boolean canViewStudent(User user, Student student) {
        return user.getRole() == UserRole.INSTRUCTOR ||
                user.getId().equals(student.getUserId());
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