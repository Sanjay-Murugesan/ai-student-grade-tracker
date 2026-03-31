package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Assignment;
import com.studenttracker.backend.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository repo;

    public AssignmentService(AssignmentRepository repo) {
        this.repo = repo;
    }

    /**
     * Saves an assignment entity.
     * 
     * @param a the assignment to save
     * @return the saved assignment
     */
    public Assignment save(Assignment a) {
        if (a == null) {
            throw new IllegalArgumentException("Assignment cannot be null");
        }
        return repo.save(a);
    }

    /**
     * Retrieves all assignments.
     * 
     * @return list of all assignments
     */
    public List<Assignment> getAll() {
        return repo.findAll();
    }

    /**
     * Retrieves an assignment by ID.
     * 
     * @param id the assignment ID
     * @return the assignment if found, null otherwise
     */
    public Assignment getById(Long id) {
        if (id == null) {
            return null;
        }
        return repo.findById(id).orElse(null);
    }

    /**
     * Updates an existing assignment.
     * 
     * @param id the assignment ID
     * @param a  the updated assignment details
     * @return the updated assignment, or null if not found
     */
    public Assignment updateAssignment(Long id, Assignment a) {
        if (id == null || a == null) {
            return null;
        }
        Assignment existing = getById(id);
        if (existing == null) {
            return null;
        }
        existing.setTitle(a.getTitle());
        existing.setDescription(a.getDescription());
        existing.setDueDate(a.getDueDate());
        existing.setMaxMarks(a.getMaxMarks());
        existing.setPriority(a.getPriority());
        return repo.save(existing);
    }

    /**
     * Deletes an assignment by ID.
     * 
     * @param id the assignment ID
     */
    public void deleteAssignment(Long id) {
        if (id == null) {
            return;
        }
        repo.deleteById(id);
    }

    /**
     * Retrieves assignments by course ID.
     * 
     * @param courseId the course ID
     * @return list of assignments for the course
     */
    public List<Assignment> findByCourseId(Long courseId) {
        if (courseId == null) {
            return List.of();
        }
        return repo.findByCourseId(courseId);
    }

    public List<Assignment> getPublishedAssignments() {
        return repo.findByPublishedTrue();
    }
}
