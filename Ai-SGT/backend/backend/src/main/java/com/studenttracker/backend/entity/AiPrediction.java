package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_prediction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long predictionId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "predicted_score")
    private Double predictedScore;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "suggestion", length = 1000)
    private String suggestion;

    @Column(name = "confidence_level")
    private Double confidenceLevel;

    @Column(name = "created_at")
    private String createdAt;
}
