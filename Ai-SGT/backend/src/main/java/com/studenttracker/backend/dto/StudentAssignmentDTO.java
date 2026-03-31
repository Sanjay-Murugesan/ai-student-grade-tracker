package com.studenttracker.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentAssignmentDTO {
    private Long assignmentId;
    private String title;
    private String course;
    private LocalDateTime dueDate;
    private String status;
    private Double marks;
    private Double maxMarks;
    private String description;
}
