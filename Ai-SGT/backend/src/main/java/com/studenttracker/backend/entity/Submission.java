package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Long submissionId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Column(name = "file_path")
    private String filePath;

    @PrePersist
    protected void onCreate() {
        submissionDate = LocalDateTime.now();
    }
}