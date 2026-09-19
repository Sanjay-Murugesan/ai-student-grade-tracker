package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Notification;
import com.studenttracker.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public Notification save(Notification notification) {
        if (notification == null) throw new IllegalArgumentException("Notification cannot be null");
        return repository.save(notification);
    }

    public List<Notification> getAll() {
        return repository.findAll();
    }

    public List<Notification> getByStudent(Long studentId) {
        if (studentId == null) return List.of();
        return repository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public void delete(Long id) {
        if (id != null) repository.deleteById(id);
    }
}
