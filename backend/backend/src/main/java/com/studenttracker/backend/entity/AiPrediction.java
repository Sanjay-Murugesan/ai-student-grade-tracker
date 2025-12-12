package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long predictionId;

    private Long studentId;

    private Double predictedScore;

    private String riskLevel;

    @Column(length = 1000)
    private String suggestion;
}

