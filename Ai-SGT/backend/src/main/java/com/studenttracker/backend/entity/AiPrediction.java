package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_prediction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prediction_id")
    private Long predictionId;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "predicted_score")
    private Double predictedScore;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(length = 1000)
    private String suggestion;

    @Column(name = "confidence_level")
    private Double confidenceLevel;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}