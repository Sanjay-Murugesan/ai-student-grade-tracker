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
        if (s == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }
        return repo.save(s);
    }

    public Student createStudent(Student s) {
        if (s == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }
        return repo.save(s);
    }

    public List<Student> getAll() {
        return repo.findAll();
    }

    public Student getById(Long id) {
        if (id == null) {
            return null;
        }
        return repo.findById(id).orElse(null);
    }

    public Optional<Student> getByUserId(Long userId) {
        if (userId == null) {
            return Optional.empty();
        }
        return repo.findByUserId(userId);
    }

    public Student update(Long id, Student s) {
        if (id == null || s == null) {
            return null;
        }

        Student ex = getById(id);

        if (ex == null) {
            return null;
        }

        ex.setName(s.getName());
        ex.setEmail(s.getEmail());
        ex.setDepartment(s.getDepartment());
        ex.setYear(s.getYear());
        ex.setSemester(s.getSemester());
        ex.setSection(s.getSection());
        ex.setUserId(s.getUserId());
        ex.setGpa(s.getGpa());
        ex.setCgpa(s.getCgpa());
        ex.setAttendancePercentage(s.getAttendancePercentage());
        ex.setSubjectAttendance(s.getSubjectAttendance());

        return repo.save(ex);
    }

    public void delete(Long id) {
        if (id == null) {
            return;
        }
        repo.deleteById(id);
    }
}