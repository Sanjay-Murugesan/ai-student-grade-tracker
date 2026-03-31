package com.studenttracker.backend.controller;

import com.studenttracker.backend.dto.BulkGradeRequest;
import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.service.GradeService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.UserService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/grades", "/api/grades"})
@CrossOrigin("*")
public class GradeController {

    private final GradeService gradeService;
    private final StudentService studentService;
    private final UserService userService;

    public GradeController(GradeService gradeService, StudentService studentService, UserService userService) {
        this.gradeService = gradeService;
        this.studentService = studentService;
        this.userService = userService;
    }

    @PostMapping
    public Grade add(@RequestBody Grade grade) {
        return gradeService.save(grade);
    }

    @PostMapping("/bulk")
    public List<Grade> bulkSave(@RequestBody List<BulkGradeRequest> requests) {
        Long userId = userService.getUserByEmail(getPrincipalEmail()).map(User::getId).orElse(null);
        return gradeService.saveBulkGrades(requests, userId);
    }

    @GetMapping
    public List<Grade> all() {
        return gradeService.getAll();
    }

    @GetMapping("/my")
    public List<Grade> getMyGrades() {
        Student student = studentService.getByEmail(getPrincipalEmail())
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        return gradeService.getByStudent(student.getStudentId());
    }

    @GetMapping("/{id}")
    public Grade get(@PathVariable Long id) {
        return gradeService.getById(id);
    }

    @GetMapping("/student/{id}")
    public List<Grade> byStudent(@PathVariable Long id) {
        return gradeService.getByStudent(id);
    }

    @GetMapping("/assignment/{id}")
    public List<Grade> byAssignment(@PathVariable Long id) {
        return gradeService.getByAssignment(id);
    }

    @PutMapping("/{id}")
    public Grade update(@PathVariable Long id, @RequestBody Grade grade) {
        return gradeService.updateGrade(id, grade);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        gradeService.deleteGrade(id);
    }

    private String getPrincipalEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? null : authentication.getName();
    }
}
