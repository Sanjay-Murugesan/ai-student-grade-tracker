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
        return submissionRepository.save(submission);
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public List<Submission> getSubmissionsByStudentId(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public List<Submission> getSubmissionsByAssignmentId(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public Optional<Submission> getSubmissionByStudentAndAssignment(Long studentId, Long assignmentId) {
        return submissionRepository.findByStudentIdAndAssignmentId(studentId, assignmentId);
    }

    public Submission updateSubmission(Long id, Submission submissionDetails) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (submissionDetails.getFilePath() != null) {
            submission.setFilePath(submissionDetails.getFilePath());
        }

        return submissionRepository.save(submission);
    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }
}
