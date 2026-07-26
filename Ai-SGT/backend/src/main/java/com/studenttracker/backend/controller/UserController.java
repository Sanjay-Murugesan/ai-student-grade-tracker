package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // Signup API
    // =========================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        if (user.getRole() == null) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        if (userService.getUserByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }

        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        User createdUser = userService.createUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // =========================
    // Create User
    // =========================
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    // =========================
    // Get User By ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {

        Optional<User> user = userService.getUserById(id);

        return user
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =========================
    // Get User By Username
    // =========================
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {

        Optional<User> user = userService.getUserByUsername(username);

        return user
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =========================
    // Get User By Email
    // =========================
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {

        Optional<User> user = userService.getUserByEmail(email);

        return user
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =========================
    // Get All Users
    // =========================
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    // =========================
    // Update User
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails) {

        User updatedUser = userService.updateUser(id, userDetails);

        return ResponseEntity.ok(updatedUser);
    }

    // =========================
    // Delete User
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}