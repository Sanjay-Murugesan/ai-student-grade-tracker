package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Assignment;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.service.AssignmentService;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/assignments")
@CrossOrigin("*")
public class AssignmentController {

    private final AssignmentService service;
    private final UserService userService;

    public AssignmentController(AssignmentService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Assignment a) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can add assignments");
        }
        return ResponseEntity.ok(service.save(a));
    }

    @GetMapping
    public ResponseEntity<?> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (userService.getUserFromAuthorizationHeader(authorization).isEmpty()) {
            return unauthorized();
        }
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        if (userService.getUserFromAuthorizationHeader(authorization).isEmpty()) {
            return unauthorized();
        }
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id, @RequestBody Assignment a) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can update assignments");
        }
        return ResponseEntity.ok(service.updateAssignment(id, a));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) {
            return unauthorized();
        }
        if (user.get().getRole() != UserRole.INSTRUCTOR) {
            return forbidden("Only teachers can delete assignments");
        }
        service.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
    }

    private ResponseEntity<Map<String, String>> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", message));
    }
}
