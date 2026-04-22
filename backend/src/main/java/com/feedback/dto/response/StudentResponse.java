package com.feedback.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String rollNumber;
    private String department;
    private Integer semester;
    private String profileImageUrl;
    private Double averageRating;
    private Long totalFeedbacks;
    private LocalDateTime createdAt;
}
