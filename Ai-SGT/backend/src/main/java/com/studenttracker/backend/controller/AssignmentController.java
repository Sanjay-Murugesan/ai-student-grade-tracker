package com.studenttracker.backend.controller;

import com.studenttracker.backend.dto.StudentAssignmentDTO;
import com.studenttracker.backend.entity.Assignment;
import com.studenttracker.backend.entity.Course;
import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.entity.Submission;
import com.studenttracker.backend.entity.SubmissionStatus;
import com.studenttracker.backend.service.AssignmentService;
import com.studenttracker.backend.service.CourseService;
import com.studenttracker.backend.service.GradeService;
import com.studenttracker.backend.service.StudentService;
import com.studenttracker.backend.service.SubmissionService;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/assignments", "/api/assignments"})
@CrossOrigin("*")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final StudentService studentService;
    private final SubmissionService submissionService;
    private final GradeService gradeService;
    private final CourseService courseService;

    public AssignmentController(
            AssignmentService assignmentService,
            StudentService studentService,
            SubmissionService submissionService,
            GradeService gradeService,
            CourseService courseService) {
        this.assignmentService = assignmentService;
        this.studentService = studentService;
        this.submissionService = submissionService;
        this.gradeService = gradeService;
        this.courseService = courseService;
    }

    @PostMapping
    public Assignment add(@RequestBody Assignment assignment) {
        return assignmentService.save(assignment);
    }

    @GetMapping
    public List<Assignment> all() {
        return assignmentService.getAll();
    }

    @GetMapping("/my")
    public List<StudentAssignmentDTO> getMyAssignments() {
        Student student = studentService.getByEmail(getPrincipalEmail())
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        List<Submission> submissions = submissionService.getSubmissionsByStudentId(student.getStudentId());
        List<Grade> grades = gradeService.getByStudent(student.getStudentId());

        return assignmentService.getPublishedAssignments().stream()
                .sorted(Comparator.comparing(Assignment::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(assignment -> {
                    Submission submission = submissions.stream()
                            .filter(item -> item.getAssignmentId().equals(assignment.getAssignmentId()))
                            .findFirst()
                            .orElse(null);
                    Grade grade = grades.stream()
                            .filter(item -> assignment.getAssignmentId().equals(item.getAssignmentId()))
                            .findFirst()
                            .orElse(null);
                    String status = resolveAssignmentStatus(assignment, submission, grade);
                    Course course = courseService.getCourseById(assignment.getCourseId()).orElse(null);
                    return new StudentAssignmentDTO(
                            assignment.getAssignmentId(),
                            assignment.getTitle(),
                            course == null ? "General" : course.getCourseName(),
                            assignment.getDueDate(),
                            status,
                            grade == null ? null : grade.getScore(),
                            grade == null ? (assignment.getMaxMarks() == null ? null : assignment.getMaxMarks().doubleValue()) : grade.getMaxScore(),
                            assignment.getDescription());
                })
                .toList();
    }

    @GetMapping("/{id}")
    public Assignment get(@PathVariable Long id) {
        return assignmentService.getById(id);
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<Assignment> publish(@PathVariable Long id) {
        return ResponseEntity.ok(publishAssignment(id));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<Assignment> publishPatch(@PathVariable Long id) {
        return ResponseEntity.ok(publishAssignment(id));
    }

    @PutMapping("/{id}")
    public Assignment update(@PathVariable Long id, @RequestBody Assignment assignment) {
        return assignmentService.updateAssignment(id, assignment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
    }

    private Assignment publishAssignment(Long id) {
        Assignment assignment = assignmentService.getById(id);
        assignment.setPublished(true);
        if (assignment.getDueDate() == null) {
            assignment.setDueDate(LocalDateTime.now().plusDays(7));
        }
        return assignmentService.save(assignment);
    }

    private String resolveAssignmentStatus(Assignment assignment, Submission submission, Grade grade) {
        if (grade != null) {
            return SubmissionStatus.GRADED.name();
        }
        if (submission == null) {
            return SubmissionStatus.PENDING.name();
        }
        if (submission.getStatus() != null && submission.getStatus() != SubmissionStatus.PENDING) {
            return submission.getStatus().name();
        }
        if (assignment.getDueDate() != null && assignment.getDueDate().isBefore(LocalDateTime.now())) {
            return SubmissionStatus.LATE.name();
        }
        return SubmissionStatus.SUBMITTED.name();
    }

    private String getPrincipalEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? null : authentication.getName();
    }
}
