package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gradeId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(nullable = false)
    private Double score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "graded_by")
    private Long gradedBy;

    @Column(name = "graded_at")
    private String gradedAt;
}
