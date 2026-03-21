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

    /**
     * Creates a new submission.
     * 
     * @param submission the submission to create
     * @return the saved submission
     */
    public Submission createSubmission(Submission submission) {
        if (submission == null) {
            throw new IllegalArgumentException("Submission cannot be null");
        }
        return submissionRepository.save(submission);
    }

    /**
     * Retrieves a submission by ID.
     * 
     * @param id the submission ID
     * @return Optional containing the submission if found
     */
    public Optional<Submission> getSubmissionById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return submissionRepository.findById(id);
    }

    /**
     * Retrieves all submissions.
     * 
     * @return list of all submissions
     */
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    /**
     * Retrieves submissions by student ID.
     * 
     * @param studentId the student ID
     * @return list of submissions for the student
     */
    public List<Submission> getSubmissionsByStudentId(Long studentId) {
        if (studentId == null) {
            return List.of();
        }
        return submissionRepository.findByStudentId(studentId);
    }

    /**
     * Retrieves submissions by assignment ID.
     * 
     * @param assignmentId the assignment ID
     * @return list of submissions for the assignment
     */
    public List<Submission> getSubmissionsByAssignmentId(Long assignmentId) {
        if (assignmentId == null) {
            return List.of();
        }
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    /**
     * Retrieves a submission by student and assignment IDs.
     * 
     * @param studentId    the student ID
     * @param assignmentId the assignment ID
     * @return Optional containing the submission if found
     */
    public Optional<Submission> getSubmissionByStudentAndAssignment(Long studentId, Long assignmentId) {
        if (studentId == null || assignmentId == null) {
            return Optional.empty();
        }
        return submissionRepository.findByStudentIdAndAssignmentId(studentId, assignmentId);
    }

    /**
     * Updates an existing submission.
     * 
     * @param id                the submission ID
     * @param submissionDetails the updated submission details
     * @return the updated submission
     * @throws RuntimeException if submission not found
     */
    public Submission updateSubmission(Long id, Submission submissionDetails) {
        if (id == null || submissionDetails == null) {
            throw new IllegalArgumentException("ID and submission details cannot be null");
        }
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (submissionDetails.getFilePath() != null) {
            submission.setFilePath(submissionDetails.getFilePath());
        }

        return submissionRepository.save(submission);
    }

    /**
     * Deletes a submission by ID.
     * 
     * @param id the submission ID
     */
    public void deleteSubmission(Long id) {
        if (id == null) {
            return;
        }
        submissionRepository.deleteById(id);
    }
}
