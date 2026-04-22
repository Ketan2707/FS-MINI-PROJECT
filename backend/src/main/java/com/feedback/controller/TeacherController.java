package com.feedback.controller;

import com.feedback.dto.response.ApiResponse;
import com.feedback.entity.User;
import com.feedback.enums.Role;
import com.feedback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherInfo>>> getTeachers() {
        List<TeacherInfo> teachers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.TEACHER)
                .map(u -> new TeacherInfo(u.getId(), u.getUsername(), u.getEmail()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(teachers));
    }

    public record TeacherInfo(Long id, String username, String email) {}
}
