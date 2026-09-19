package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "grade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id")
    private Long gradeId;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "assignment_id")
    private Long assignmentId;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "internal_marks")
    private Double internalMarks;

    @Column(name = "semester_marks")
    private Double semesterMarks;

    @Column(name = "assignment_marks")
    private Double assignmentMarks;

    private Double marks;

    @Column(name = "grade")
    private String grade;

    private Integer semester;

    @Column(name = "grade_points")
    private Double gradePoints;

    private Double score;

    @Column(length = 1000)
    private String feedback;

    @Column(name = "graded_by")
    private Long gradedBy;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @PrePersist
    protected void onCreate() {
        if (gradedAt == null) {
            gradedAt = LocalDateTime.now();
        }
    }
}
