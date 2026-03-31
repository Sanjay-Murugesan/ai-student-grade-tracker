package com.studenttracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentDashboardDTO {
    private Long studentId;
    private String name;
    private Double gpa;
    private Double attendancePercent;
    private int pendingAssignments;
    private String riskLevel;
}
