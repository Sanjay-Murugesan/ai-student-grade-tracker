package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.service.GradeService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/grades")
@CrossOrigin("*")
public class GradeController {

    private final GradeService service;
    private final StudentService studentService;
    private final UserService userService;

    public GradeController(GradeService service, StudentService studentService, UserService userService) {
        this.service = service;
        this.studentService = studentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Grade g) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can upload marks");
        }
        return ResponseEntity.ok(service.save(g));
    }

    @GetMapping
    public ResponseEntity<?> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can view all grades");
        }
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }

        Grade grade = service.getById(id);
        if (grade == null) {
            return ResponseEntity.notFound().build();
        }
        if (!canViewStudent(user.get(), grade.getStudentId())) {
            return forbidden("You can only view your own grades");
        }
        return ResponseEntity.ok(grade);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<?> byStudent(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (!canViewStudent(user.get(), id)) {
            return forbidden("You can only view your own grades");
        }
        return ResponseEntity.ok(service.getByStudent(id));
    }

    @GetMapping("/student/{id}/summary")
    public ResponseEntity<?> gpaSummary(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (!canViewStudent(user.get(), id)) {
            return forbidden("You can only view your own GPA summary");
        }
        return ResponseEntity.ok(service.calculateGpaSummary(id));
    }

    @GetMapping("/assignment/{id}")
    public ResponseEntity<?> byAssignment(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can view assignment grade lists");
        }
        return ResponseEntity.ok(service.getByAssignment(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id, @RequestBody Grade g) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can edit grades");
        }
        return ResponseEntity.ok(service.updateGrade(id, g));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can delete grades");
        }
        service.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }

    private boolean canViewStudent(User user, Long studentId) {
        if (user.getRole() == UserRole.INSTRUCTOR) {
            return true;
        }
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
