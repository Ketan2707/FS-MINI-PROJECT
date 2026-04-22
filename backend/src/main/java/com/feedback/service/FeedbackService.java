package com.feedback.service;

import com.feedback.dto.request.FeedbackRequest;
import com.feedback.dto.response.FeedbackResponse;
import com.feedback.entity.*;
import com.feedback.enums.FeedbackCategory;
import com.feedback.exception.ResourceNotFoundException;
import com.feedback.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final RatingSummaryRepository ratingSummaryRepository;

    @Transactional
    public FeedbackResponse submitFeedback(FeedbackRequest request, String username) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.getSubjectId()));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Feedback feedback = Feedback.builder()
                .student(student)
                .subject(subject)
                .submittedBy(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .category(request.getCategory())
                .build();

        feedback = feedbackRepository.save(feedback);

        // Update rating summary
        updateRatingSummary(student.getId(), subject.getId());

        return mapToResponse(feedback);
    }

    public Page<FeedbackResponse> getFeedbacks(Long studentId, Long subjectId,
                                                FeedbackCategory category, Pageable pageable) {
        Page<Feedback> feedbacks;

        if (studentId != null && subjectId != null) {
            feedbacks = feedbackRepository.findByStudentIdAndSubjectId(studentId, subjectId, pageable);
        } else if (studentId != null) {
            feedbacks = feedbackRepository.findByStudentId(studentId, pageable);
        } else if (subjectId != null) {
            feedbacks = feedbackRepository.findBySubjectId(subjectId, pageable);
        } else if (category != null) {
            feedbacks = feedbackRepository.findByCategory(category, pageable);
        } else {
            feedbacks = feedbackRepository.findAll(pageable);
        }

        return feedbacks.map(this::mapToResponse);
    }

    public FeedbackResponse getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", "id", id));
        return mapToResponse(feedback);
    }

    @Transactional
    public void deleteFeedback(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", "id", id));

        Long studentId = feedback.getStudent().getId();
        Long subjectId = feedback.getSubject().getId();

        feedbackRepository.deleteById(id);

        // Recalculate rating summary
        updateRatingSummary(studentId, subjectId);
    }

    private void updateRatingSummary(Long studentId, Long subjectId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (student == null || subject == null) return;

        Double avgRating = feedbackRepository.findAverageRatingByStudentId(studentId);
        Long count = feedbackRepository.countByStudentId(studentId);

        RatingSummary summary = ratingSummaryRepository
                .findByStudentIdAndSubjectId(studentId, subjectId)
                .orElse(RatingSummary.builder()
                        .student(student)
                        .subject(subject)
                        .build());

        summary.setAverageRating(avgRating != null ? avgRating : 0.0);
        summary.setTotalFeedbacks(count != null ? count.intValue() : 0);
        ratingSummaryRepository.save(summary);
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .studentName(feedback.getStudent().getFirstName() + " " + feedback.getStudent().getLastName())
                .studentId(feedback.getStudent().getId())
                .subjectName(feedback.getSubject().getName())
                .subjectId(feedback.getSubject().getId())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .category(feedback.getCategory())
                .submittedBy(feedback.getSubmittedBy().getUsername())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
