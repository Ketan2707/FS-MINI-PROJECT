package com.feedback.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Long totalStudents;
    private Long totalFeedbacks;
    private Double averageRating;
    private Long totalTeachers;
    private Long feedbacksThisMonth;
    private Map<Integer, Long> ratingDistribution;
    private Map<String, Long> categoryBreakdown;
    private List<TopStudent> topStudents;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopStudent {
        private Long id;
        private String firstName;
        private String lastName;
        private Double averageRating;
        private Long feedbackCount;
    }
}
