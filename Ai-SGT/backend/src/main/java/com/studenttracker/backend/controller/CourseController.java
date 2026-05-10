package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Course;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.service.CourseService;
import com.studenttracker.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/courses")
@CrossOrigin("*")
public class CourseController {

    private final CourseService courseService;
    private final UserService userService;

    public CourseController(CourseService courseService, UserService userService) {
        this.courseService = courseService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Course course) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can create courses");
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.ok(createdCourse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        if (userService.getUserFromAuthorizationHeader(authorization).isEmpty()) return unauthorized();
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (userService.getUserFromAuthorizationHeader(authorization).isEmpty()) return unauthorized();
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<?> getCoursesByInstructor(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long instructorId) {
        if (userService.getUserFromAuthorizationHeader(authorization).isEmpty()) return unauthorized();
        List<Course> courses = courseService.getCoursesByInstructorId(instructorId);
        return ResponseEntity.ok(courses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id, @RequestBody Course courseDetails) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can update courses");
        Course updatedCourse = courseService.updateCourse(id, courseDetails);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id) {
        Optional<User> user = userService.getUserFromAuthorizationHeader(authorization);
        if (user.isEmpty()) return unauthorized();
        if (user.get().getRole() != UserRole.INSTRUCTOR) return forbidden("Only teachers can delete courses");
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
    }

    private ResponseEntity<Map<String, String>> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", message));
    }
}
