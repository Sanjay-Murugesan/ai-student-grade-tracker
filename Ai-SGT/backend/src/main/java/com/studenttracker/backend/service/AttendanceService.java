package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Attendance;
import com.studenttracker.backend.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository repository;

    public AttendanceService(AttendanceRepository repository) {
        this.repository = repository;
    }

    public Attendance save(Attendance attendance) {
        if (attendance == null) {
            throw new IllegalArgumentException("Attendance cannot be null");
        }
        return repository.save(attendance);
    }

    public List<Attendance> getAll() {
        return repository.findAll();
    }

    public Optional<Attendance> getById(Long id) {
        if (id == null) return Optional.empty();
        return repository.findById(id);
    }

    public List<Attendance> getByStudent(Long studentId) {
        if (studentId == null) return List.of();
        return repository.findByStudentId(studentId);
    }

    public List<Attendance> getByCourse(Long courseId) {
        if (courseId == null) return List.of();
        return repository.findByCourseId(courseId);
    }

    public Attendance update(Long id, Attendance details) {
        Attendance existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
        if (details.getStudentId() != null) existing.setStudentId(details.getStudentId());
        if (details.getCourseId() != null) existing.setCourseId(details.getCourseId());
        if (details.getTotalClasses() != null) existing.setTotalClasses(details.getTotalClasses());
        if (details.getAttendedClasses() != null) existing.setAttendedClasses(details.getAttendedClasses());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (id != null) repository.deleteById(id);
    }
}
