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

    public Assignment save(Assignment a) {
        return repo.save(a);
    }

    public List<Assignment> getAll() {
        return repo.findAll();
    }

    public Assignment getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Assignment updateAssignment(Long id, Assignment a) {
        Assignment existing = getById(id);
        if (existing == null)
            return null;
        existing.setTitle(a.getTitle());
        existing.setDescription(a.getDescription());
        existing.setDueDate(a.getDueDate());
        existing.setMaxMarks(a.getMaxMarks());
        return repo.save(existing);
    }

    public void deleteAssignment(Long id) {
        repo.deleteById(id);
    }

    public List<Assignment> findByCourseId(Long courseId) {
        return repo.findByCourseId(courseId);
    }
}
