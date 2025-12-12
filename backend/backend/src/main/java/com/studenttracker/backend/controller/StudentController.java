package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin("*")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @PostMapping
    public Student add(@RequestBody Student s) { return service.save(s); }

    @GetMapping
    public List<Student> all() { return service.getAll(); }

    @GetMapping("/{id}")
    public Student get(@PathVariable Long id) { return service.getById(id); }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student s) {
        return service.update(id, s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
