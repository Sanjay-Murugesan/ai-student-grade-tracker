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

    public Optional<Instructor> getInstructorByUserId(Long userId) {
        return instructorRepository.findByUserId(userId);
    }

    public List<Instructor> getAllInstructors() {
        return instructorRepository.findAll();
    }

    public Instructor updateInstructor(Long id, Instructor instructorDetails) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        if (instructorDetails.getName() != null) {
            instructor.setName(instructorDetails.getName());
        }
        if (instructorDetails.getEmail() != null) {
            instructor.setEmail(instructorDetails.getEmail());
        }
        if (instructorDetails.getDepartment() != null) {
            instructor.setDepartment(instructorDetails.getDepartment());
        }

        return instructorRepository.save(instructor);
    }

    public void deleteInstructor(Long id) {
        instructorRepository.deleteById(id);
    }
}
