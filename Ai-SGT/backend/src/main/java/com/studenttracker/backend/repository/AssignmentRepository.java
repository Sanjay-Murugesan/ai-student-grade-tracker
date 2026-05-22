package com.studenttracker.backend.repository;

import com.studenttracker.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // Get assignments for a course
    List<Assignment> findByCourseId(Long courseId);

    // Get assignments created by one instructor
    List<Assignment> findByInstructorId(Long instructorId);

    // Get assignments by status: PENDING, OVERDUE, COMPLETED
    List<Assignment> findByStatus(String status);

    // Get assignments for one instructor and one course
    List<Assignment> findByInstructorIdAndCourseId(Long instructorId, Long courseId);
}