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

    private Double score;

    @Column(length = 1000)
    private String feedback;

    @Column(name = "graded_by")
    private Long gradedBy;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;
}