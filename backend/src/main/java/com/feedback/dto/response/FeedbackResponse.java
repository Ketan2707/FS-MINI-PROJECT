package com.feedback.dto.response;

import com.feedback.enums.FeedbackCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {

    private Long id;
    private String studentName;
    private Long studentId;
    private String subjectName;
    private Long subjectId;
    private Integer rating;
    private String comment;
    private FeedbackCategory category;
    private String submittedBy;
    private LocalDateTime createdAt;
}
