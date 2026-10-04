package com.cloudtask.controller;

import com.cloudtask.dto.ApiResponse;
import com.cloudtask.dto.DashboardStatsResponse;
import com.cloudtask.dto.TaskRequest;
import com.cloudtask.dto.TaskResponse;
import com.cloudtask.entity.Priority;
import com.cloudtask.entity.TaskStatus;
import com.cloudtask.entity.User;
import com.cloudtask.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String search) {
        if (user == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        List<TaskResponse> tasks = taskService.getAllTasks(user, status, priority, search);
        return ResponseEntity.ok(ApiResponse.success("Tasks fetched successfully", tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        TaskResponse task = taskService.getTaskById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Task fetched successfully", task));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        TaskResponse created = taskService.createTask(request, user);
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        TaskResponse updated = taskService.updateTask(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        taskService.deleteTask(id, user);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats(
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthorized"), HttpStatus.UNAUTHORIZED);
        }
        DashboardStatsResponse stats = taskService.getDashboardStats(user);
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", stats));
    }
}
