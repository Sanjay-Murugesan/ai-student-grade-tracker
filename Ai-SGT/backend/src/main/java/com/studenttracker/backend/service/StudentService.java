package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public Student save(Student s) {
        return repo.save(s);
    }

    public List<Student> getAll() {
        return repo.findAll();
    }

    public Student getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Optional<Student> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public Student createStudent(Student s) {
        return repo.save(s);
    }

    public Student update(Long id, Student s) {
        Student ex = getById(id);
        if (ex == null)
            return null;

        ex.setName(s.getName());
        ex.setEmail(s.getEmail());
        ex.setDepartment(s.getDepartment());
        ex.setYear(s.getYear());

        return repo.save(ex);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
