package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.AiPrediction;
import com.studenttracker.backend.entity.Attendance;
import com.studenttracker.backend.entity.Submission;
import com.studenttracker.backend.service.AiService;
import com.studenttracker.backend.service.AttendanceService;
import com.studenttracker.backend.service.GradeService;
import com.studenttracker.backend.service.SubmissionService;
import org.springframework.beans.factory.annotation.Value;
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
    private final AttendanceService attendanceService;
    private final SubmissionService submissionService;

    @Value("${ml.api.url}")
    private String mlApiUrl;

    public AiController(
            GradeService gradeService,
            AiService aiService,
            AttendanceService attendanceService,
            SubmissionService submissionService
    ) {
        this.gradeService = gradeService;
        this.aiService = aiService;
        this.attendanceService = attendanceService;
        this.submissionService = submissionService;
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

        List<Double> scores = gradeService.getByStudent(studentId).stream()
                .map(g -> g.getMarks() != null ? g.getMarks() : g.getScore())
                .filter(Objects::nonNull)
                .toList();

        List<Double> attendance = attendanceService.getByStudent(studentId).stream()
                .map(Attendance::getPercentage)
                .filter(Objects::nonNull)
                .toList();

        List<Submission> submissions = submissionService.getSubmissionsByStudentId(studentId);

        if (scores.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "No marks found for this student"));
        }

        Map<String, Object> request = new HashMap<>();
        request.put("studentId", studentId);
        request.put("previousMarks", scores);
        request.put(
                "attendance",
                attendance.isEmpty()
                        ? 0
                        : attendance.stream().mapToDouble(Double::doubleValue).average().orElse(0)
        );
        request.put("assignmentMarks", scores);
        request.put("previousGpa", gradeService.calculateGpaSummary(studentId).get("gpa"));
        request.put(
                "submissionDelay",
                submissions.stream()
                        .filter(s -> "LATE".equalsIgnoreCase(s.getStatus()))
                        .count()
        );

        Map<String, Object> result = callAiService(request);

        AiPrediction p = new AiPrediction();
        p.setStudentId(studentId);
        p.setPredictedScore(
                Double.parseDouble(
                        result.getOrDefault("predictedScore", result.get("prediction")).toString()
                )
        );
        p.setRiskLevel(result.get("risk").toString());
        p.setSuggestion(result.get("suggestion").toString());

        aiService.savePrediction(p);

        return ResponseEntity.ok(result);
    }

    /**
     * Gives simple performance insights for a student.
     *
     * @param studentId the student ID
     * @return insight result
     */
    @GetMapping("/insights/{studentId}")
    public ResponseEntity<?> insights(@PathVariable Long studentId) {
        List<String> insights = new ArrayList<>();

        double avgMarks = gradeService.getByStudent(studentId).stream()
                .map(g -> g.getMarks() != null ? g.getMarks() : g.getScore())
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);

        double avgAttendance = attendanceService.getByStudent(studentId).stream()
                .map(Attendance::getPercentage)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);

        long missingAssignments = submissionService.getSubmissionsByStudentId(studentId).stream()
                .filter(s ->
                        "MISSING".equalsIgnoreCase(s.getStatus())
                                || "LATE".equalsIgnoreCase(s.getStatus())
                )
                .count();

        if (avgAttendance > 0 && avgAttendance < 75) {
            insights.add("Attendance below safe level.");
        }

        if (avgMarks > 0 && avgMarks < 60) {
            insights.add("Low marks detected. Review weak subjects before the next assessment.");
        }

        if (missingAssignments > 0) {
            insights.add("Assignment submission rate is low.");
        }

        if (insights.isEmpty()) {
            insights.add("Performance indicators are currently stable.");
        }

        return ResponseEntity.ok(Map.of(
                "studentId", studentId,
                "averageMarks", avgMarks,
                "averageAttendance", avgAttendance,
                "insights", insights
        ));
    }

    /**
     * Calls FastAPI ML engine.
     * If ML engine is unavailable, fallback prediction logic will run.
     *
     * @param request student performance data
     * @return prediction result
     */
    private Map<String, Object> callAiService(Map<String, Object> request) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(mlApiUrl + "/predict", entity, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> result = (Map<String, Object>) response.getBody();

            if (result != null) {
                return result;
            }
        } catch (Exception ignored) {
            // If ML engine is down, fallback logic below will run.
        }

        @SuppressWarnings("unchecked")
        List<Double> previousMarks = (List<Double>) request.get("previousMarks");

        double avg = previousMarks.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);

        double attendance = Double.parseDouble(request.get("attendance").toString());
        double gpa = Double.parseDouble(request.get("previousGpa").toString());

        double predicted = Math.min(
                100,
                Math.max(
                        0,
                        (avg * 0.55) + (attendance * 0.25) + (gpa * 10 * 0.2)
                )
        );

        String risk = predicted < 60 || attendance < 75
                ? "High"
                : predicted < 75 ? "Medium" : "Low";

        String suggestion = attendance < 75
                ? "Attendance below safe level. Attend more classes and revise missed topics."
                : predicted < 70
                        ? "Improve preparation in low-scoring subjects and submit assignments on time."
                        : "Maintain consistency and keep assignment submissions current.";

        return Map.of(
                "studentId", request.get("studentId"),
                "predictedScore", predicted,
                "risk", risk,
                "suggestion", suggestion
        );
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