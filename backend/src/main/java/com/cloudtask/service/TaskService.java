package com.cloudtask.service;

import com.cloudtask.dto.DashboardStatsResponse;
import com.cloudtask.dto.TaskRequest;
import com.cloudtask.dto.TaskResponse;
import com.cloudtask.entity.Priority;
import com.cloudtask.entity.Task;
import com.cloudtask.entity.TaskStatus;
import com.cloudtask.entity.User;
import com.cloudtask.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(User user, TaskStatus status, Priority priority, String search) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        List<Task> tasks;

        if (status == null && priority == null && cleanSearch == null) {
            tasks = taskRepository.findByUserOrderByCreatedAtDesc(user);
        } else {
            tasks = taskRepository.findWithFilters(user, status, priority, cleanSearch);
        }

        return tasks.stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, User user) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        return TaskResponse.fromEntity(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request, User user) {
        Task task = new Task(
                request.getTitle().trim(),
                request.getDescription() != null ? request.getDescription().trim() : null,
                request.getPriority(),
                request.getStatus(),
                user);

        Task savedTask = taskRepository.save(task);

        return TaskResponse.fromEntity(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, User user) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        task.setTitle(request.getTitle().trim());
        task.setDescription(
                request.getDescription() != null
                        ? request.getDescription().trim()
                        : null);

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        Task updatedTask = taskRepository.save(task);

        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(User user) {
        long totalTasks = taskRepository.countByUser(user);

        long pendingTasks = taskRepository.countByUserAndStatus(user, TaskStatus.TODO);

        long inProgressTasks = taskRepository.countByUserAndStatus(user, TaskStatus.IN_PROGRESS);

        long completedTasks = taskRepository.countByUserAndStatus(user, TaskStatus.COMPLETED);

        long highPriorityTasks = taskRepository.countByUserAndPriority(user, Priority.HIGH);

        List<TaskResponse> recentTasks = taskRepository.findTop5ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                highPriorityTasks,
                recentTasks);
    }
}