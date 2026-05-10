package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long attendanceId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "total_classes")
    private Integer totalClasses = 0;

    @Column(name = "attended_classes")
    private Integer attendedClasses = 0;

    private Double percentage = 0.0;

    @PrePersist
    @PreUpdate
    protected void calculatePercentage() {
        if (totalClasses == null || totalClasses <= 0) {
            percentage = 0.0;
            return;
        }
        int attended = attendedClasses == null ? 0 : attendedClasses;
        percentage = Math.round(((attended * 100.0) / totalClasses) * 100.0) / 100.0;
    }
}
