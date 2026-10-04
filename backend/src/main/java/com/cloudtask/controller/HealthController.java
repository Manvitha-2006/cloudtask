package com.cloudtask.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", "CloudTask");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("environment", "AWS CI/CD Blue-Green Deployment Ready");
        return ResponseEntity.ok(health);
    }
}
