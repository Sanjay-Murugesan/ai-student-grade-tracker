package com.studenttracker.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "instructor")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private String name;

    private String email;

    private String department;
}