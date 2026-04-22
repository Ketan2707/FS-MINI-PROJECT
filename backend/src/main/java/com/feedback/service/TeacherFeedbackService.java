package com.feedback.service;

import com.feedback.dto.request.TeacherFeedbackRequest;
import com.feedback.dto.response.TeacherFeedbackResponse;
import com.feedback.entity.Student;
import com.feedback.entity.TeacherFeedback;
import com.feedback.entity.User;
import com.feedback.enums.Role;
import com.feedback.enums.TeacherFeedbackCategory;
import com.feedback.exception.ResourceNotFoundException;
import com.feedback.repository.StudentRepository;
import com.feedback.repository.TeacherFeedbackRepository;
import com.feedback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeacherFeedbackService {

    private final TeacherFeedbackRepository teacherFeedbackRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public TeacherFeedbackResponse submitFeedback(TeacherFeedbackRequest request, String username) {
        // Find the logged-in user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Find the student profile linked to this user
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + username));

        // Validate the teacher exists and has TEACHER role
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", request.getTeacherId()));

        if (teacher.getRole() != Role.TEACHER) {
            throw new IllegalArgumentException("The specified user is not a teacher");
        }

        TeacherFeedback feedback = TeacherFeedback.builder()
                .teacher(teacher)
                .student(student)
                .rating(request.getRating())
                .comment(request.getComment())
                .category(request.getCategory())
                .build();

        feedback = teacherFeedbackRepository.save(feedback);

        return mapToResponse(feedback);
    }

    public Page<TeacherFeedbackResponse> getFeedbacks(Long teacherId, TeacherFeedbackCategory category,
                                                       Pageable pageable) {
        Page<TeacherFeedback> feedbacks;

        if (teacherId != null && category != null) {
            feedbacks = teacherFeedbackRepository.findByTeacherIdAndCategory(teacherId, category, pageable);
        } else if (teacherId != null) {
            feedbacks = teacherFeedbackRepository.findByTeacherId(teacherId, pageable);
        } else if (category != null) {
            feedbacks = teacherFeedbackRepository.findByCategory(category, pageable);
        } else {
            feedbacks = teacherFeedbackRepository.findAll(pageable);
        }

        return feedbacks.map(this::mapToResponse);
    }

    public Page<TeacherFeedbackResponse> getMyFeedbacks(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + username));

        return teacherFeedbackRepository.findByStudentId(student.getId(), pageable)
                .map(this::mapToResponse);
    }

    public TeacherFeedbackResponse getFeedbackById(Long id) {
        TeacherFeedback feedback = teacherFeedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TeacherFeedback", "id", id));
        return mapToResponse(feedback);
    }

    @Transactional
    public void deleteFeedback(Long id) {
        if (!teacherFeedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("TeacherFeedback", "id", id);
        }
        teacherFeedbackRepository.deleteById(id);
    }

    private TeacherFeedbackResponse mapToResponse(TeacherFeedback feedback) {
        return TeacherFeedbackResponse.builder()
                .id(feedback.getId())
                .teacherId(feedback.getTeacher().getId())
                .teacherName(feedback.getTeacher().getUsername())
                .studentId(feedback.getStudent().getId())
                .studentName(feedback.getStudent().getFirstName() + " " + feedback.getStudent().getLastName())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .category(feedback.getCategory())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
