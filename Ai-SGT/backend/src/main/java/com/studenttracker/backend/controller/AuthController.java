package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.Instructor;

import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.InstructorService;
import com.studenttracker.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;
    private final StudentService studentService;
    private final InstructorService instructorService;

    public AuthController(
            UserService userService,
            StudentService studentService,
            InstructorService instructorService
    ) {
        this.userService = userService;
        this.studentService = studentService;
        this.instructorService = instructorService;
    }

    // ================= SIGNUP =================

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody Map<String, Object> request
    ) {

        try {

            // ================= VALIDATION =================

            if (request == null || request.isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Request body cannot be empty"
                        ));
            }

            String username = (String) request.get("username");

            String email = (String) request.get("email");

            String password = (String) request.get("password");

            String role = (String) request.get("role");

            String name = (String) request.get("name");

            String department = (String) request.get("department");

            Object yearObj = request.get("year");

            // ================= REQUIRED FIELD CHECK =================

            if (username == null || username.trim().isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Username is required"
                        ));
            }

            if (email == null || email.trim().isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Email is required"
                        ));
            }

            if (password == null || password.trim().isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Password is required"
                        ));
            }

            if (role == null || role.trim().isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Role is required"
                        ));
            }

            // ================= YEAR PARSING =================

            Integer year = null;

            if (yearObj != null) {

                if (yearObj instanceof Integer) {

                    year = (Integer) yearObj;

                } else if (yearObj instanceof Double) {

                    year = ((Double) yearObj).intValue();

                } else if (yearObj instanceof String) {

                    try {

                        year = Integer.parseInt(
                                (String) yearObj
                        );

                    } catch (NumberFormatException e) {

                        return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(Map.of(
                                        "message",
                                        "Year must be a valid number"
                                ));
                    }
                }
            }

            // ================= EXISTING USER CHECK =================

            Optional<User> existingUser =
                    userService.getUserByUsername(
                            username.trim()
                    );

            if (existingUser.isPresent()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Username already exists"
                        ));
            }

            Optional<User> existingEmail =
                    userService.getUserByEmail(
                            email.trim()
                    );

            if (existingEmail.isPresent()) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Email already exists"
                        ));
            }

            // ================= CREATE USER =================

            User user = new User();

            user.setUsername(username.trim());

            user.setEmail(email.trim());

            user.setPassword(password);

            // ================= ROLE SET =================

            if ("STUDENT".equalsIgnoreCase(role)) {

                user.setRole(UserRole.STUDENT);

            } else if ("INSTRUCTOR".equalsIgnoreCase(role)) {

                user.setRole(UserRole.INSTRUCTOR);

            } else {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Invalid role. Must be STUDENT or INSTRUCTOR"
                        ));
            }

            // ================= SAVE USER =================

            User createdUser =
                    userService.createUser(user);

            // ================= CREATE STUDENT =================

            if (createdUser.getRole() == UserRole.STUDENT) {

                Student student = new Student();

                student.setUserId(createdUser.getId());

                student.setName(
                        name != null && !name.isBlank()
                                ? name
                                : createdUser.getUsername()
                );

                student.setEmail(createdUser.getEmail());

                student.setDepartment(
                        department != null
                                ? department
                                : "IT"
                );

                student.setYear(
                        year != null
                                ? year
                                : 3
                );

                studentService.createStudent(student);
            }

            // ================= CREATE INSTRUCTOR =================

            else if (
                    createdUser.getRole()
                            == UserRole.INSTRUCTOR
            ) {

                Instructor instructor =
                        new Instructor();

                instructor.setUserId(
                        createdUser.getId()
                );

                instructor.setName(
                        name != null && !name.isBlank()
                                ? name
                                : createdUser.getUsername()
                );

                instructor.setEmail(
                        createdUser.getEmail()
                );

                instructor.setDepartment(
                        department != null
                                ? department
                                : "IT"
                );

                instructorService.createInstructor(
                        instructor
                );
            }

            // ================= SUCCESS RESPONSE =================

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Signup successful"
            );

            response.put(
                    "user",
                    Map.of(
                            "id",
                            createdUser.getId(),

                            "username",
                            createdUser.getUsername(),

                            "email",
                            createdUser.getEmail(),

                            "role",
                            createdUser.getRole().toString()
                    )
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Signup failed: "
                                    + e.getMessage()
                    ));
        }
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, Object> request
    ) {

        try {

            String username =
                    (String) request.get("username");

            String email =
                    (String) request.get("email");

            String password =
                    (String) request.get("password");

            String role =
                    (String) request.get("role");

            String identifier =
                    email != null && !email.isBlank()
                            ? email
                            : username;

            Optional<User> userOpt =
                    userService.authenticate(
                            identifier,
                            password,
                            role
                    );

            if (userOpt.isEmpty()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "Invalid credentials or role"
                        ));
            }

            User user = userOpt.get();

            String token =
                    userService.generateToken(user);

            Map<String, Object> response =
                    new HashMap<>();

            response.put("token", token);

            response.put(
                    "user",
                    Map.of(
                            "id",
                            user.getId(),

                            "username",
                            user.getUsername(),

                            "email",
                            user.getEmail(),

                            "role",
                            user.getRole()
                    )
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Login failed: "
                                    + e.getMessage()
                    ));
        }
    }
}