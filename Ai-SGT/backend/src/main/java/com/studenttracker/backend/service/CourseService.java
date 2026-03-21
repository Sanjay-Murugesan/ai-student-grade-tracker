package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Course;
import com.studenttracker.backend.repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    /**
     * Creates a new course.
     * 
     * @param course the course to create
     * @return the saved course
     */
    public Course createCourse(Course course) {
        if (course == null) {
            throw new IllegalArgumentException("Course cannot be null");
        }
        return courseRepository.save(course);
    }

    /**
     * Retrieves a course by ID.
     * 
     * @param id the course ID
     * @return Optional containing the course if found
     */
    public Optional<Course> getCourseById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return courseRepository.findById(id);
    }

    /**
     * Retrieves all courses.
     * 
     * @return list of all courses
     */
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    /**
     * Retrieves courses by instructor ID.
     * 
     * @param instructorId the instructor ID
     * @return list of courses for the instructor
     */
    public List<Course> getCoursesByInstructorId(Long instructorId) {
        if (instructorId == null) {
            return List.of();
        }
        return courseRepository.findByInstructorId(instructorId);
    }

    /**
     * Updates an existing course.
     * 
     * @param id            the course ID
     * @param courseDetails the updated course details
     * @return the updated course
     * @throws RuntimeException if course not found
     */
    public Course updateCourse(Long id, Course courseDetails) {
        if (id == null || courseDetails == null) {
            throw new IllegalArgumentException("ID and course details cannot be null");
        }
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (courseDetails.getCourseName() != null) {
            course.setCourseName(courseDetails.getCourseName());
        }
        if (courseDetails.getDescription() != null) {
            course.setDescription(courseDetails.getDescription());
        }
        if (courseDetails.getInstructorId() != null) {
            course.setInstructorId(courseDetails.getInstructorId());
        }

        return courseRepository.save(course);
    }

    /**
     * Deletes a course by ID.
     * 
     * @param id the course ID
     */
    public void deleteCourse(Long id) {
        if (id == null) {
            return;
        }
        courseRepository.deleteById(id);
    }
}
