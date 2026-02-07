package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.service.GradeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grades")
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

    @GetMapping("/student/{id}")
    public List<Grade> byStudent(@PathVariable Long id) {
        return service.getByStudent(id);
    }

    @GetMapping("/assignment/{id}")
    public List<Grade> byAssignment(@PathVariable Long id) {
        return service.getByAssignment(id);
    }
}
