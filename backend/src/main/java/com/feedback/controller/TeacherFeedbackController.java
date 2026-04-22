package com.feedback.controller;

import com.feedback.dto.request.TeacherFeedbackRequest;
import com.feedback.dto.response.ApiResponse;
import com.feedback.dto.response.TeacherFeedbackResponse;
import com.feedback.enums.TeacherFeedbackCategory;
import com.feedback.service.TeacherFeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher-feedback")
@RequiredArgsConstructor
public class TeacherFeedbackController {

    private final TeacherFeedbackService teacherFeedbackService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<TeacherFeedbackResponse>> submitFeedback(
            @Valid @RequestBody TeacherFeedbackRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TeacherFeedbackResponse response = teacherFeedbackService.submitFeedback(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TeacherFeedbackResponse>>> getFeedbacks(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) TeacherFeedbackCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<TeacherFeedbackResponse> feedbacks = teacherFeedbackService.getFeedbacks(
                teacherId, category,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));

        return ResponseEntity.ok(ApiResponse.success(feedbacks));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Page<TeacherFeedbackResponse>>> getMyFeedbacks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<TeacherFeedbackResponse> feedbacks = teacherFeedbackService.getMyFeedbacks(
                userDetails.getUsername(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));

        return ResponseEntity.ok(ApiResponse.success(feedbacks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherFeedbackResponse>> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(teacherFeedbackService.getFeedbackById(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Long id) {
        teacherFeedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.success("Teacher feedback deleted successfully", null));
    }
}
