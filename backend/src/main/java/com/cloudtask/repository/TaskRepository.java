package com.cloudtask.repository;

import com.cloudtask.entity.Priority;
import com.cloudtask.entity.Task;
import com.cloudtask.entity.TaskStatus;
import com.cloudtask.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserOrderByCreatedAtDesc(User user);

    Optional<Task> findByIdAndUser(Long id, User user);

    List<Task> findByUserAndStatusOrderByCreatedAtDesc(User user, TaskStatus status);

    List<Task> findByUserAndPriorityOrderByCreatedAtDesc(User user, Priority priority);

    long countByUser(User user);

    long countByUserAndStatus(User user, TaskStatus status);

    long countByUserAndPriority(User user, Priority priority);

    List<Task> findTop5ByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.createdAt DESC")
    List<Task> findWithFilters(
            @Param("user") User user,
            @Param("status") TaskStatus status,
            @Param("priority") Priority priority,
            @Param("search") String search
    );
}
