package com.studenttracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentRosterDTO {
    private Long studentId;
    private String name;
    private String email;
    private Double gpa;
    private Double submissionRate;
    private String riskLevel;
    private Double riskScore;
}
