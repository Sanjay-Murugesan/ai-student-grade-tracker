package com.studenttracker.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkGradeRequest {
    private Long studentId;
    private Long courseId;
    private Long assignmentId;
    private Double score;
    private Double maxScore;
    private String gradeType;
}
