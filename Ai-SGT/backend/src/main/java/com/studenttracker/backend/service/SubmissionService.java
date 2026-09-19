package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Submission;
import com.studenttracker.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    public Submission createSubmission(Submission submission) {
        if (submission == null) {
            throw new IllegalArgumentException("Submission cannot be null");
        }

        if (submission.getStudentId() == null || submission.getAssignmentId() == null) {
            throw new IllegalArgumentException("Student ID and Assignment ID are required");
        }

        Optional<Submission> existingSubmission =
                submissionRepository.findByStudentIdAndAssignmentId(
                        submission.getStudentId(),
                        submission.getAssignmentId()
                );

        if (existingSubmission.isPresent()) {
            throw new RuntimeException("Student already submitted this assignment");
        }

        return submissionRepository.save(submission);
    }

    public Optional<Submission> getSubmissionById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return submissionRepository.findById(id);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public List<Submission> getSubmissionsByStudentId(Long studentId) {
        if (studentId == null) {
            return List.of();
        }
        return submissionRepository.findByStudentId(studentId);
    }

    public List<Submission> getSubmissionsByAssignmentId(Long assignmentId) {
        if (assignmentId == null) {
            return List.of();
        }
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public Optional<Submission> getSubmissionByStudentAndAssignment(Long studentId, Long assignmentId) {
        if (studentId == null || assignmentId == null) {
            return Optional.empty();
        }
        return submissionRepository.findByStudentIdAndAssignmentId(studentId, assignmentId);
    }

    public Submission updateSubmission(Long id, Submission submissionDetails) {
        if (id == null || submissionDetails == null) {
            throw new IllegalArgumentException("ID and submission details cannot be null");
        }

        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (submissionDetails.getFilePath() != null) {
            submission.setFilePath(submissionDetails.getFilePath());
        }

        if (submissionDetails.getMarks() != null) {
            submission.setMarks(submissionDetails.getMarks());
        }

        if (submissionDetails.getStatus() != null) {
            submission.setStatus(submissionDetails.getStatus());
        }

        if (submissionDetails.getSubmittedDate() != null) {
            submission.setSubmittedDate(submissionDetails.getSubmittedDate());
        }

        return submissionRepository.save(submission);
    }

    public Submission gradeSubmission(Long id, Double marks) {
        if (id == null || marks == null) {
            throw new IllegalArgumentException("Submission ID and marks are required");
        }

        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setMarks(marks);
        submission.setStatus("GRADED");

        return submissionRepository.save(submission);
    }


    

    public void deleteSubmission(Long id) {
        if (id == null) {
            return;
        }
        submissionRepository.deleteById(id);
    }
}