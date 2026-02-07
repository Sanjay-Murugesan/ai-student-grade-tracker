package com.studenttracker.backend.repository;

import com.studenttracker.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentId(Long studentId);
    List<Submission> findByAssignmentId(Long assignmentId);
    Optional<Submission> findByStudentIdAndAssignmentId(Long studentId, Long assignmentId);
}
