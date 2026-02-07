package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.AiPrediction;
import com.studenttracker.backend.repository.AiPredictionRepository;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final AiPredictionRepository repo;

    public AiService(AiPredictionRepository repo) {
        this.repo = repo;
    }

    public void savePrediction(AiPrediction p) {
        repo.save(p);
    }

    public AiPrediction getPrediction(Long studentId) {
        return repo.findByStudentId(studentId).orElse(null);
    }
}
