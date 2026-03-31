package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.repository.GradeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class GradeService {

    private final GradeRepository repo;

    public GradeService(GradeRepository repo) {
        this.repo = repo;
    }

    /**
     * Saves a grade — blocks duplicate (same student + assignment).
     */
    public Grade save(Grade g) {
        if (g == null) throw new IllegalArgumentException("Grade cannot be null");

        // ── Duplicate guard ──
        if (g.getStudentId() != null && g.getAssignmentId() != null) {
            boolean exists = repo.findByStudentId(g.getStudentId())
                    .stream()
                    .anyMatch(existing -> existing.getAssignmentId() != null
                            && existing.getAssignmentId().equals(g.getAssignmentId()));
            if (exists) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Grade for this student and assignment already exists. Use PUT to update."
                );
            }
        }
        return repo.save(g);
    }

    public List<Grade> getByStudent(Long id) {
        if (id == null) return List.of();
        return repo.findByStudentId(id);
    }

    public List<Grade> getByAssignment(Long id) {
        if (id == null) return List.of();
        return repo.findByAssignmentId(id);
    }

    public Grade createGrade(Grade grade) { return save(grade); }

    public Grade getById(Long id) {
        if (id == null) return null;
        return repo.findById(id).orElse(null);
    }

    public List<Grade> getAll() { return repo.findAll(); }

    public Grade updateGrade(Long id, Grade grade) {
        if (id == null || grade == null) return null;
        Grade existing = getById(id);
        if (existing == null) return null;
        existing.setScore(grade.getScore());
        if (grade.getFeedback()  != null) existing.setFeedback(grade.getFeedback());
        if (grade.getGradedBy()  != null) existing.setGradedBy(grade.getGradedBy());
        if (grade.getGradedAt()  != null) existing.setGradedAt(grade.getGradedAt());
        return repo.save(existing);
    }

    public void deleteGrade(Long id) {
        if (id == null) return;
        repo.deleteById(id);
    }
}