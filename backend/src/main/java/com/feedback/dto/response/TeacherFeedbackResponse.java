package com.feedback.dto.response;

import com.feedback.enums.TeacherFeedbackCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherFeedbackResponse {

    private Long id;
    private Long teacherId;
    private String teacherName;
    private Long studentId;
    private String studentName;
    private Integer rating;
    private String comment;
    private TeacherFeedbackCategory category;
    private LocalDateTime createdAt;
}
