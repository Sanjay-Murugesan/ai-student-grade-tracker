package com.studenttracker.backend.controller;

import com.studenttracker.backend.dto.TeacherDashboardDTO;
import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.service.GradeService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.SubmissionService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin("*")
public class TeacherController {

    private final StudentService studentService;
    private final GradeService gradeService;
    private final SubmissionService submissionService;

    public TeacherController(StudentService studentService, GradeService gradeService, SubmissionService submissionService) {
        this.studentService = studentService;
        this.gradeService = gradeService;
        this.submissionService = submissionService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<TeacherDashboardDTO> getTeacherDashboard() {
        List<Grade> grades = gradeService.getAll();
        double classAverage = grades.stream()
                .mapToDouble(grade -> grade.getScore() == null ? 0.0 : grade.getScore())
                .average()
                .orElse(0.0);
        int atRiskCount = (int) studentService.getAll().stream()
                .filter(student -> student.getGpa() != null && student.getGpa() < 2.5)
                .count();

        TeacherDashboardDTO dto = new TeacherDashboardDTO(
                studentService.getAll().size(),
                Math.round(classAverage * 100.0) / 100.0,
                atRiskCount,
                submissionService.getUngradedSubmissions().size());
        return ResponseEntity.ok(dto);
    }
}
