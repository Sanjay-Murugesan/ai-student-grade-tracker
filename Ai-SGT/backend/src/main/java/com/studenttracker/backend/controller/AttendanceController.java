package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Attendance;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.service.AttendanceService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/attendance")
@CrossOrigin("*")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final StudentService studentService;
    private final UserService userService;

    public AttendanceController(AttendanceService attendanceService, StudentService studentService, UserService userService) {
        this.attendanceService = attendanceService;
        this.studentService = studentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> mark(@RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Attendance attendance) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can mark attendance");
        return ResponseEntity.ok(attendanceService.save(attendance));
    }

    @GetMapping
    public ResponseEntity<?> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can view all attendance");
        return ResponseEntity.ok(attendanceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        Optional<Attendance> attendance = attendanceService.getById(id);
        if (attendance.isEmpty()) return ResponseEntity.notFound().build();
        if (!canViewStudent(user.get(), attendance.get().getStudentId())) {
            return forbidden("Students can only view their own attendance");
        }
        return ResponseEntity.ok(attendance.get());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> byStudent(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long studentId) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (!canViewStudent(user.get(), studentId)) return forbidden("Students can only view their own attendance");
        return ResponseEntity.ok(attendanceService.getByStudent(studentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id, @RequestBody Attendance attendance) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can update attendance");
        return ResponseEntity.ok(attendanceService.update(id, attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can delete attendance");
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
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
