package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    private String name;

    private String email;

    private String department;

    private Integer year;

    private Integer semester;

    private String section;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "enrollment_date")
    private LocalDateTime enrollmentDate;

    @Column(name = "gpa")
    private Double gpa = 0.0;

    @Column(name = "cgpa")
    private Double cgpa = 0.0;

    @Column(name = "attendance_percentage")
    private Double attendancePercentage = 0.0;

    @Column(name = "subject_attendance", length = 2000)
    private String subjectAttendance;

    @PrePersist
    protected void onCreate() {
        if (enrollmentDate == null) {
            enrollmentDate = LocalDateTime.now();
        }

        if (gpa == null) {
            gpa = 0.0;
        }

        if (cgpa == null) {
            cgpa = 0.0;
        }

        if (attendancePercentage == null) {
            attendancePercentage = 0.0;
        }

        normalizeFields();
    }

    @PreUpdate
    protected void onUpdate() {
        normalizeFields();
    }

    private void normalizeFields() {
        if (department != null) {
            department = department.trim().toUpperCase();
        }

        if (section != null) {
            section = section.trim().toUpperCase();
        }

        if (email != null) {
            email = email.trim().toLowerCase();
        }

        if (name != null) {
            name = name.trim();
        }
    }
}