package com.studenttracker.backend.service;

import com.studenttracker.backend.dto.AuthRequest;
import com.studenttracker.backend.dto.AuthResponse;
import com.studenttracker.backend.dto.RegisterRequest;
import com.studenttracker.backend.entity.Instructor;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.repository.UserRepository;
import com.studenttracker.backend.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentService studentService;
    private final InstructorService instructorService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(
            UserRepository userRepository,
            StudentService studentService,
            InstructorService instructorService,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.studentService = studentService;
        this.instructorService = instructorService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        UserRole role = parseRole(request.getRole());
        User user = new User();
        user.setUsername(request.getEmail().trim());
        user.setEmail(request.getEmail().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        User savedUser = userRepository.save(user);

        if (role == UserRole.STUDENT) {
            Student student = new Student();
            student.setUserId(savedUser.getId());
            student.setName(request.getName());
            student.setEmail(savedUser.getEmail());
            student.setAttendancePercent(88.0);
            studentService.createStudent(student);
        } else {
            Instructor instructor = new Instructor();
            instructor.setUserId(savedUser.getId());
            instructor.setName(request.getName());
            instructor.setEmail(savedUser.getEmail());
            instructorService.createInstructor(instructor);
        }

        String securityRole = role.toSecurityRole();
        return new AuthResponse(
                jwtUtils.generateToken(savedUser.getEmail(), securityRole),
                securityRole,
                savedUser.getId(),
                request.getName());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String role = user.getRole().toSecurityRole();
        String name = user.getUsername();
        if (user.getRole() == UserRole.STUDENT) {
            name = studentService.getByUserId(user.getId()).map(Student::getName).orElse(name);
        } else {
            name = instructorService.getInstructorByUserId(user.getId()).map(Instructor::getName).orElse(name);
        }

        return new AuthResponse(jwtUtils.generateToken(user.getEmail(), role), role, user.getId(), name);
    }

    private UserRole parseRole(String rawRole) {
        if (rawRole == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }
        String normalized = rawRole.trim().toUpperCase();
        if ("TEACHER".equals(normalized) || "INSTRUCTOR".equals(normalized)) {
            return UserRole.TEACHER;
        }
        if ("STUDENT".equals(normalized)) {
            return UserRole.STUDENT;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be STUDENT or TEACHER");
    }
}
