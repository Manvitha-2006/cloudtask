package com.cloudtask.controller;

import com.cloudtask.dto.ApiResponse;
import com.cloudtask.dto.AuthResponse;
import com.cloudtask.dto.LoginRequest;
import com.cloudtask.dto.RegisterRequest;
import com.cloudtask.dto.UserResponse;
import com.cloudtask.entity.User;
import com.cloudtask.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("Account created successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        UserResponse response = authService.getProfile(user);
        return ResponseEntity.ok(ApiResponse.success("User profile fetched", response));
    }
}
