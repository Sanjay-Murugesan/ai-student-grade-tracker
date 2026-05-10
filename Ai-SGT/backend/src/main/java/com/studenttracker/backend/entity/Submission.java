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

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "file_path")
    private String filePath;

    private Double marks;

    private String status = "SUBMITTED";

    @PrePersist
    protected void onCreate() {
        if (submittedDate == null) {
            submittedDate = LocalDateTime.now();
        }
        if (status == null || status.isBlank()) {
            status = "SUBMITTED";
        }
    }
}
