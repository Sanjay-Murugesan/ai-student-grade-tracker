package com.studenttracker.backend.repository;

import com.studenttracker.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {}
