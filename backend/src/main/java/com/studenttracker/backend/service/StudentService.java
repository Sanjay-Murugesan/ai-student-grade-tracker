package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    /**
        
    

     * Saves a student entity to th
         database.
    

     * @param s the student to save
        
    
     * @return the saved student
     */
    public Student save(Student s) {
        if  (s == null)
            {
            throw new IllegalArgumentException("Student cannot be null");
        }
        return repo.save(s);
    }

    /**
     * Retrieves all students from the database.
     * @return list of all students
     */
    public List<Student> getAll()
        {
    
        return repo.findAll();
    }

    /**
     * Retrieves a student by ID.
     * @param id the student ID
     * @return the student if found, null otherwise
     */
    public Student getById(Long id) {
        if (id == null) {
            return null;
        }
        return repo.findById(id).orElse(null);
    }

    /**
     * Updates an existing student.
     * @param id the student ID
     * @param s the updated student data
     * @return the updated student, or null if not found
     */
    public Student update(Long id, Student s) {
        if (id == null || s == null) {
            return null;
        }
        Student ex = getById(id);
        if (ex == null) {
            return null;
        }

        ex.setName(s.getName());
        ex.setEmail(s.getEmail());
        ex.setDepartment(s.getDepartment());
        ex.setYear(s.getYear());

        return repo.save(ex);
    }

    /**
     * Deletes a student by ID.
     * @param id the student ID
     */
    public void delete(Long id) {
        if (id == null) {
            return;
        }
        repo.deleteById(id);
    }
}
