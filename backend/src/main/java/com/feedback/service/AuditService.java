package com.feedback.service;

import com.feedback.entity.AuditLog;
import com.feedback.entity.User;
import com.feedback.repository.AuditLogRepository;
import com.feedback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public void log(String username, String action, String entityType, Long entityId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return;

        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .build();

        auditLogRepository.save(auditLog);
    }
}
