package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.repository.GradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    private final GradeRepository repo;

    public GradeService(GradeRepository repo) {
        this.repo = repo;
    }

    /**
     * Saves a grade entity.
     * 
     * @param g the grade to save
     * @return the saved grade
     */
    public Grade save(Grade g) {
        if (g == null) {
            throw new IllegalArgumentException("Grade cannot be null");
        }
        return repo.save(g);
    }

    /**
     * Retrieves grades by student ID.
     * 
     * @param id the student ID
     * @return list of grades for the student
     */
    public List<Grade> getByStudent(Long id) {
        if (id == null) {
            return List.of();
        }
        return repo.findByStudentId(id);
    }

    /**
     * Retrieves grades by assignment ID.
     * 
     * @param id the assignment ID
     * @return list of grades for the assignment
     */
    public List<Grade> getByAssignment(Long id) {
        if (id == null) {
            return List.of();
        }
        return repo.findByAssignmentId(id);
    }

    /**
     * Creates a new grade.
     * 
     * @param grade the grade to create
     * @return the saved grade
     */
    public Grade createGrade(Grade grade) {
        return save(grade);
    }

    /**
     * Retrieves a grade by ID.
     * 
     * @param id the grade ID
     * @return the grade if found, null otherwise
     */
    public Grade getById(Long id) {
        if (id == null) {
            return null;
        }
        return repo.findById(id).orElse(null);
    }

    /**
     * Retrieves all grades.
     * 
     * @return list of all grades
     */
    public List<Grade> getAll() {
        return repo.findAll();
    }

    /**
     * Updates an existing grade.
     * 
     * @param id    the grade ID
     * @param grade the updated grade details
     * @return the updated grade, or null if not found
     */
    public Grade updateGrade(Long id, Grade grade) {
        if (id == null || grade == null) {
            return null;
        }
        Grade existing = getById(id);
        if (existing == null) {
            return null;
        }
        existing.setScore(grade.getScore());
        existing.setFeedback(grade.getFeedback());
        existing.setGradedBy(grade.getGradedBy());
        existing.setGradedAt(grade.getGradedAt());
        return repo.save(existing);
    }

    /**
     * Deletes a grade by ID.
     * 
     * @param id the grade ID
     */
    public void deleteGrade(Long id) {
        if (id == null) {
            return;
        }
        repo.deleteById(id);
    }
}
