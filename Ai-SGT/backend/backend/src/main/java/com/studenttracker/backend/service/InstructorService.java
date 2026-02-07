package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Instructor;
import com.studenttracker.backend.repository.InstructorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstructorService {
    private final InstructorRepository instructorRepository;

    public InstructorService(InstructorRepository instructorRepository) {
        this.instructorRepository = instructorRepository;
    }

    public Instructor createInstructor(Instructor instructor) {
        return instructorRepository.save(instructor);
    }

    public Optional<Instructor> getInstructorById(Long id) {
        return instructorRepository.findById(id);
    }

    public List<Instructor> getAllInstructors() {
        return instructorRepository.findAll();
    }

    public Optional<Instructor> getInstructorByUserId(Long userId) {
        return instructorRepository.findByUserId(userId);
    }

    public Instructor updateInstructor(Long id, Instructor instructor) {
        Optional<Instructor> existing = instructorRepository.findById(id);
        if (existing.isPresent()) {
            Instructor i = existing.get();
            if (instructor.getName() != null)
                i.setName(instructor.getName());
            if (instructor.getEmail() != null)
                i.setEmail(instructor.getEmail());
            if (instructor.getDepartment() != null)
                i.setDepartment(instructor.getDepartment());
            return instructorRepository.save(i);
        }
        return null;
    }

    public void deleteInstructor(Long id) {
        instructorRepository.deleteById(id);
    }
}
