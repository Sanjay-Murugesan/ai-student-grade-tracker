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

    /**
     * Creates a new instructor.
     * 
     * @param instructor the instructor to create
     * @return the saved instructor
     */
    public Instructor createInstructor(Instructor instructor) {
        if (instructor == null) {
            throw new IllegalArgumentException("Instructor cannot be null");
        }
        return instructorRepository.save(instructor);
    }

    /**
     * Retrieves an instructor by ID.
     * 
     * @param id the instructor ID
     * @return Optional containing the instructor if found
     */
    public Optional<Instructor> getInstructorById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return instructorRepository.findById(id);
    }

    /**
     * Retrieves an instructor by user ID.
     * 
     * @param userId the user ID
     * @return Optional containing the instructor if found
     */
    public Optional<Instructor> getInstructorByUserId(Long userId) {
        if (userId == null) {
            return Optional.empty();
        }
        return instructorRepository.findByUserId(userId);
    }

    /**
     * Retrieves all instructors.
     * 
     * @return list of all instructors
     */
    public List<Instructor> getAllInstructors() {
        return instructorRepository.findAll();
    }

    /**
     * Updates an existing instructor.
     * 
     * @param id                the instructor ID
     * @param instructorDetails the updated instructor details
     * @return the updated instructor
     * @throws RuntimeException if instructor not found
     */
    public Instructor updateInstructor(Long id, Instructor instructorDetails) {
        if (id == null || instructorDetails == null) {
            throw new IllegalArgumentException("ID and instructor details cannot be null");
        }
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

    /**
     * Deletes an instructor by ID.
     * 
     * @param id the instructor ID
     */
    public void deleteInstructor(Long id) {
        if (id == null) {
            return;
        }
        instructorRepository.deleteById(id);
    }
}
