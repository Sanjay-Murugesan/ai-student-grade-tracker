package com.studenttracker.backend.repository;

import com.studenttracker.backend.entity.AiPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiPredictionRepository extends JpaRepository<AiPrediction, Long> {
    Optional<AiPrediction> findByStudentId(Long studentId);
}
