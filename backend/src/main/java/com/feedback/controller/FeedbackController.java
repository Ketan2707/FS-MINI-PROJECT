package com.feedback.controller;

import com.feedback.dto.request.FeedbackRequest;
import com.feedback.dto.response.ApiResponse;
import com.feedback.dto.response.FeedbackResponse;
import com.feedback.enums.FeedbackCategory;
import com.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackResponse>> submitFeedback(
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        FeedbackResponse response = feedbackService.submitFeedback(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FeedbackResponse>>> getFeedbacks(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) FeedbackCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<FeedbackResponse> feedbacks = feedbackService.getFeedbacks(
                studentId, subjectId, category,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));

        return ResponseEntity.ok(ApiResponse.success(feedbacks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbackById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted successfully", null));
    }
}
