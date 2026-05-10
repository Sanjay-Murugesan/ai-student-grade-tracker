package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long assignmentId;

    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "max_marks")
    private Integer maxMarks;

    @Column(name = "priority")
    private String priority;

    private String status = "PENDING";

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (dueDate != null && dueDate.isBefore(LocalDate.now())) {
            status = "OVERDUE";
        } else if (status == null || status.isBlank()) {
            status = "PENDING";
        }
    }
}
