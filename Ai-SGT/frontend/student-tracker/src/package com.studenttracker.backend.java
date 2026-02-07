package com.studenttracker.backend.repository;

import com.studenttracker.backend.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    Optional<Instructor> findByUserId(Long userId);
}