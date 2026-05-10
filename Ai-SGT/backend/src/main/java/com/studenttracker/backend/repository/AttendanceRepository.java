package com.studenttracker.backend.repository;

import com.studenttracker.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByCourseId(Long courseId);
    Optional<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
}
