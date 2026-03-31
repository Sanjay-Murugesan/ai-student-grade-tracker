package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Assignment;
import com.studenttracker.backend.repository.AssignmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository repo;

    public AssignmentService(AssignmentRepository repo) {
        this.repo = repo;
    }

    /**
     * Saves an assignment — blocks duplicate title (case-insensitive).
     */
    public Assignment save(Assignment a) {
        if (a == null) throw new IllegalArgumentException("Assignment cannot be null");

        // ── Duplicate title guard ──
        if (a.getTitle() != null) {
            boolean titleExists = repo.findAll().stream()
                    .anyMatch(existing ->
                            existing.getTitle() != null &&
                            existing.getTitle().trim().equalsIgnoreCase(a.getTitle().trim()));
            if (titleExists) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "An assignment with this title already exists."
                );
            }
        }
        return repo.save(a);
    }

    public List<Assignment> getAll() { return repo.findAll(); }

    public Assignment getById(Long id) {
        if (id == null) return null;
        return repo.findById(id).orElse(null);
    }

    public Assignment updateAssignment(Long id, Assignment a) {
        if (id == null || a == null) return null;
        Assignment existing = getById(id);
        if (existing == null) return null;
        existing.setTitle(a.getTitle());
        existing.setDescription(a.getDescription());
        existing.setDueDate(a.getDueDate());
        existing.setMaxMarks(a.getMaxMarks());
        existing.setPriority(a.getPriority());
        return repo.save(existing);
    }

    public void deleteAssignment(Long id) {
        if (id == null) return;
        repo.deleteById(id);
    }

    public List<Assignment> findByCourseId(Long courseId) {
        if (courseId == null) return List.of();
        return repo.findByCourseId(courseId);
    }
}