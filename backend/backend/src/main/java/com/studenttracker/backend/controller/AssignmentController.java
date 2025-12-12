package com.studenttracker.backend.controller;

import com.studenttracker.backend.entity.Assignment;
import com.studenttracker.backend.service.AssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@CrossOrigin("*")
public class AssignmentController {

    private final AssignmentService service;

    public AssignmentController(AssignmentService service) {
        this.service = service;
    }

    @PostMapping
    public Assignment add(@RequestBody Assignment a) { return service.save(a); }

    @GetMapping
    public List<Assignment> all() { return service.getAll(); }
}
