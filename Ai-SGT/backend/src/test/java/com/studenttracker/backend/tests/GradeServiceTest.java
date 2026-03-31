package com.studenttracker.backend.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.studenttracker.backend.dto.BulkGradeRequest;
import com.studenttracker.backend.entity.Grade;
import com.studenttracker.backend.repository.GradeRepository;
import com.studenttracker.backend.service.GradeService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GradeServiceTest {

    @Mock
    private GradeRepository gradeRepository;

    @InjectMocks
    private GradeService gradeService;

    @Test
    void getGradesByStudentIdReturnsOnlyThatStudentsGrades() {
        Grade grade = new Grade();
        grade.setStudentId(1L);
        when(gradeRepository.findByStudentId(1L)).thenReturn(List.of(grade));

        List<Grade> grades = gradeService.getByStudent(1L);

        assertEquals(1, grades.size());
        assertEquals(1L, grades.get(0).getStudentId());
    }

    @Test
    void bulkGradeSavePersistsAllRecords() {
        BulkGradeRequest request = new BulkGradeRequest();
        request.setStudentId(1L);
        request.setCourseId(1L);
        request.setScore(88.0);
        request.setGradeType("ASSIGNMENT");

        gradeService.saveBulkGrades(List.of(request), 1L);

        verify(gradeRepository).saveAll(anyList());
    }

    @Test
    void nullStudentIdIsHandledGracefully() {
        List<Grade> grades = gradeService.getByStudent(null);
        assertTrue(grades.isEmpty());
    }
}
