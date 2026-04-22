package com.feedback.service;

import com.feedback.dto.request.LoginRequest;
import com.feedback.dto.request.RegisterRequest;
import com.feedback.dto.request.StudentRegisterRequest;
import com.feedback.dto.response.AuthResponse;
import com.feedback.entity.Student;
import com.feedback.entity.User;
import com.feedback.enums.Role;
import com.feedback.exception.DuplicateResourceException;
import com.feedback.repository.StudentRepository;
import com.feedback.repository.UserRepository;
import com.feedback.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs() / 1000)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Student", "rollNumber", request.getRollNumber());
        }

        // Create User with STUDENT role
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();

        user = userRepository.save(user);

        // Create linked Student profile
        Student student = Student.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .rollNumber(request.getRollNumber())
                .department(request.getDepartment())
                .semester(request.getSemester())
                .userId(user.getId())
                .build();

        student = studentRepository.save(student);

        String token = tokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs() / 1000)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .studentId(student.getId())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If the user is a student, include studentId
        Long studentId = null;
        if (user.getRole() == Role.STUDENT) {
            studentId = studentRepository.findByUserId(user.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs() / 1000)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .studentId(studentId)
                        .build())
                .build();
    }

    public AuthResponse.UserInfo getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long studentId = null;
        if (user.getRole() == Role.STUDENT) {
            studentId = studentRepository.findByUserId(user.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        return AuthResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .studentId(studentId)
                .build();
    }
}
