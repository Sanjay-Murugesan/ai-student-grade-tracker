package com.studenttracker.backend.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.studenttracker.backend.entity.Student;
import com.studenttracker.backend.exception.ResourceNotFoundException;
import com.studenttracker.backend.repository.StudentRepository;
import com.studenttracker.backend.service.StudentService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    void getStudentByIdReturnsCorrectStudent() {
        Student student = new Student();
        student.setStudentId(1L);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        Student result = studentService.getById(1L);

        assertEquals(1L, result.getStudentId());
    }

    @Test
    void getStudentByIdThrowsResourceNotFoundExceptionForInvalidId() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.getById(99L));
    }

    @Test
    void getStudentsByInstructorIdReturnsCorrectList() {
        Student student = new Student();
        student.setStudentId(2L);
        when(studentRepository.findAll()).thenReturn(List.of(student));

        List<Student> students = studentService.getStudentsByInstructorId(1L);

        assertEquals(1, students.size());
        verify(studentRepository).findAll();
    }
}
