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

    public Assignment save(Assignment a) { return repo.save(a); }
    public List<Assignment> getAll() { return repo.findAll(); }
}
