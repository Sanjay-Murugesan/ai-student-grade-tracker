package com.studenttracker.backend.entity;

public enum UserRole {
    STUDENT,
    TEACHER,
    INSTRUCTOR;

    public String toSecurityRole() {
        if (this == INSTRUCTOR) {
            return TEACHER.name();
        }
        return name();
    }
}
