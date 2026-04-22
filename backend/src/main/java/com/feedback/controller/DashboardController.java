package com.feedback.controller;

import com.feedback.dto.response.ApiResponse;
import com.feedback.dto.response.DashboardResponse;
import com.feedback.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardStats(
            @RequestParam(defaultValue = "10") int topStudentsLimit) {
        DashboardResponse response = dashboardService.getDashboardStats(topStudentsLimit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
