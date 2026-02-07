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

    public Grade save(Grade g) {
        return repo.save(g);
    }

    public List<Grade> getByStudent(Long id) {
        return repo.findByStudentId(id);
    }

    public List<Grade> getByAssignment(Long id) {
        return repo.findByAssignmentId(id);
    }

    public Grade createGrade(Grade grade) {
        return repo.save(grade);
    }

    public Grade getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<Grade> getAll() {
        return repo.findAll();
    }

    public Grade updateGrade(Long id, Grade grade) {
        Grade existing = getById(id);
        if (existing == null)
            return null;
        existing.setScore(grade.getScore());
        return repo.save(existing);
    }

    public void deleteGrade(Long id) {
        repo.deleteById(id);
    }
}
