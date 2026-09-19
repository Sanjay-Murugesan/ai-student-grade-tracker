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

    /**
     * Saves an AI prediction.
     * 
     * @param p the prediction to save
     */
    public void savePrediction(AiPrediction p) {
        if (p == null) {
            throw new IllegalArgumentException("Prediction cannot be null");
        }
        repo.save(p);
    }

    /**
     * Retrieves a prediction by student ID.
     * 
     * @param studentId the student ID
     * @return the prediction if found, null otherwise
     */
    public AiPrediction getPrediction(Long studentId) {
        if (studentId == null) {
            return null;
        }
        return repo.findByStudentId(studentId).orElse(null);
    }
}
