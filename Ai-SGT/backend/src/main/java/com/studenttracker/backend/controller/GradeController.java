package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.service.GradeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grades")
@CrossOrigin("*")
public class GradeController {

    private final GradeService service;

    public GradeController(GradeService service) {
        this.service = service;
    }

    @PostMapping
    public Grade add(@RequestBody Grade g) {
        return service.save(g);
    }

    @GetMapping
    public List<Grade> all() { return service.getAll(); }

    @GetMapping("/{id}")
    public Grade get(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/student/{id}")
    public List<Grade> byStudent(@PathVariable Long id) {
        return service.getByStudent(id);
    }

    @GetMapping("/assignment/{id}")
    public List<Grade> byAssignment(@PathVariable Long id) {
        return service.getByAssignment(id);
    }

    @PutMapping("/{id}")
    public Grade update(@PathVariable Long id, @RequestBody Grade g) {
        return service.updateGrade(id, g);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.deleteGrade(id); }
}
