package com.feedback.service;

import com.feedback.dto.response.DashboardResponse;
import com.feedback.enums.Role;
import com.feedback.repository.FeedbackRepository;
import com.feedback.repository.StudentRepository;
import com.feedback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboardStats(int topStudentsLimit) {
        Long totalStudents = studentRepository.count();
        Long totalFeedbacks = feedbackRepository.count();
        Double averageRating = feedbackRepository.findOverallAverageRating();
        Long totalTeachers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.TEACHER)
                .count();
        Long feedbacksThisMonth = feedbackRepository.countFeedbacksSince(
                LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0));

        // Rating distribution
        Map<Integer, Long> ratingDistribution = new LinkedHashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }
        feedbackRepository.findRatingDistribution().forEach(row -> {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingDistribution.put(rating, count);
        });

        // Category breakdown
        Map<String, Long> categoryBreakdown = new LinkedHashMap<>();
        feedbackRepository.findCategoryBreakdown().forEach(row -> {
            String category = row[0].toString();
            Long count = (Long) row[1];
            categoryBreakdown.put(category, count);
        });

        // Top rated students
        List<DashboardResponse.TopStudent> topStudents = feedbackRepository
                .findTopRatedStudents(PageRequest.of(0, topStudentsLimit))
                .stream()
                .map(row -> DashboardResponse.TopStudent.builder()
                        .id((Long) row[0])
                        .firstName((String) row[1])
                        .lastName((String) row[2])
                        .averageRating(Math.round((Double) row[3] * 10.0) / 10.0)
                        .feedbackCount((Long) row[4])
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalFeedbacks(totalFeedbacks)
                .averageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0)
                .totalTeachers(totalTeachers)
                .feedbacksThisMonth(feedbacksThisMonth)
                .ratingDistribution(ratingDistribution)
                .categoryBreakdown(categoryBreakdown)
                .topStudents(topStudents)
                .build();
    }
}
