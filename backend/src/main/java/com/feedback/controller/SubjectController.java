package com.feedback.controller;

import com.feedback.dto.response.ApiResponse;
import com.feedback.entity.Subject;
import com.feedback.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Subject>>> getAllSubjects() {
        return ResponseEntity.ok(ApiResponse.success(subjectService.getAllSubjects()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(subjectService.getSubjectById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Subject>> createSubject(@Valid @RequestBody Subject subject) {
        Subject created = subjectService.createSubject(subject);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subject created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> updateSubject(
            @PathVariable Long id, @Valid @RequestBody Subject subject) {
        return ResponseEntity.ok(ApiResponse.success(subjectService.updateSubject(id, subject)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
    }
}
