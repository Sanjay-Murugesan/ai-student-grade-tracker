package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.AiPrediction;
import com.studenttracker.backend.service.AiService;
import com.studenttracker.backend.service.GradeService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Controller for AI prediction endpoints.
 */
@RestController
@RequestMapping("/ai")
@CrossOrigin("*")
public class AiController {

    private final GradeService gradeService;
    private final AiService aiService;

    public AiController(GradeService gradeService, AiService aiService) {
        this.gradeService = gradeService;
        this.aiService = aiService;
    }

    /**
     * Predicts student performance based on previous grades.
     * 
     * @param studentId the student ID
     * @return the prediction response
     */
    @GetMapping("/predict/{studentId}")
    public ResponseEntity<?> predict(@PathVariable Long studentId) {
        if (studentId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student ID cannot be null"));
        }

        List<Double> scores = gradeService.getByStudent(studentId)
                .stream()
                .map(g -> g.getScore())
                .toList();

        if (scores.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "No marks found for this student"));
        }

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = new HashMap<>();
        request.put("studentId", studentId);
        request.put("previousMarks", scores);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity("http://localhost:8000/predict",
                entity, Map.class);

        @SuppressWarnings("unchecked")
        Map<String, Object> result = (Map<String, Object>) response.getBody();

        if (result == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get prediction from AI service"));
        }

        AiPrediction p = new AiPrediction();
        p.setStudentId(studentId);
        p.setPredictedScore(Double.parseDouble(result.get("predictedScore").toString()));
        p.setRiskLevel(result.get("risk").toString());
        p.setSuggestion(result.get("suggestion").toString());

        aiService.savePrediction(p);

        return ResponseEntity.ok(result);
    }

    /**
     * Retrieves saved prediction for a student.
     * 
     * @param studentId the student ID
     * @return the saved prediction
     */
    @GetMapping("/prediction/{studentId}")
    public AiPrediction getSaved(@PathVariable Long studentId) {
        if (studentId == null) {
            return null;
        }
        return aiService.getPrediction(studentId);
    }
}
