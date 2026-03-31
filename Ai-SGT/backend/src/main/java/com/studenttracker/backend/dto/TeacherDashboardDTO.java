package com.studenttracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TeacherDashboardDTO {
    private int totalStudents;
    private Double classAverage;
    private int atRiskCount;
    private int ungradedSubmissions;
}
