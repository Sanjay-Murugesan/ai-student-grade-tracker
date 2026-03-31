package com.studenttracker.backend.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UngradedSubmissionResponse {
    private long count;
    private List<UngradedSubmissionDTO> submissions;
}
