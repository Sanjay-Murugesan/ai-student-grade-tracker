package com.studenttracker.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GradeSubmissionRequest {
    private Double score;
    private String feedback;
}
