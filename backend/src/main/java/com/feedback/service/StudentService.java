package com.feedback.service;

import com.feedback.dto.request.StudentRequest;
import com.feedback.dto.response.StudentResponse;
import com.feedback.entity.Student;
import com.feedback.exception.DuplicateResourceException;
import com.feedback.exception.ResourceNotFoundException;
import com.feedback.repository.FeedbackRepository;
import com.feedback.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final FeedbackRepository feedbackRepository;

    public Page<StudentResponse> getAllStudents(String department, Integer semester, String search, Pageable pageable) {
        Page<Student> students;

        if (search != null && !search.isEmpty()) {
            students = studentRepository.searchStudents(search, pageable);
        } else if (department != null && semester != null) {
            students = studentRepository.findByDepartmentAndSemester(department, semester, pageable);
        } else if (department != null) {
            students = studentRepository.findByDepartment(department, pageable);
        } else if (semester != null) {
            students = studentRepository.findBySemester(semester, pageable);
        } else {
            students = studentRepository.findAll(pageable);
        }

        return students.map(this::mapToResponse);
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapToResponse(student);
    }

    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Student", "rollNumber", request.getRollNumber());
        }

        Student student = Student.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .rollNumber(request.getRollNumber())
                .department(request.getDepartment())
                .semester(request.getSemester())
                .profileImageUrl(request.getProfileImageUrl())
                .build();

        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        // Check for duplicate roll number if changed
        if (!student.getRollNumber().equals(request.getRollNumber())
                && studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Student", "rollNumber", request.getRollNumber());
        }

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setRollNumber(request.getRollNumber());
        student.setDepartment(request.getDepartment());
        student.setSemester(request.getSemester());
        student.setProfileImageUrl(request.getProfileImageUrl());

        student = studentRepository.save(student);
        return mapToResponse(student);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student", "id", id);
        }
        studentRepository.deleteById(id);
    }

    private StudentResponse mapToResponse(Student student) {
        Double avgRating = feedbackRepository.findAverageRatingByStudentId(student.getId());
        Long totalFeedbacks = feedbackRepository.countByStudentId(student.getId());

        return StudentResponse.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .rollNumber(student.getRollNumber())
                .department(student.getDepartment())
                .semester(student.getSemester())
                .profileImageUrl(student.getProfileImageUrl())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalFeedbacks(totalFeedbacks != null ? totalFeedbacks : 0L)
                .createdAt(student.getCreatedAt())
                .build();
    }
}
