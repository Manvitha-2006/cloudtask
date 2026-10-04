package com.cloudtask.dto;

import java.util.List;

public class DashboardStatsResponse {

    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long highPriorityTasks;
    private List<TaskResponse> recentTasks;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalTasks, long pendingTasks, long inProgressTasks,
                                  long completedTasks, long highPriorityTasks, List<TaskResponse> recentTasks) {
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
        this.highPriorityTasks = highPriorityTasks;
        this.recentTasks = recentTasks;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getHighPriorityTasks() {
        return highPriorityTasks;
    }

    public void setHighPriorityTasks(long highPriorityTasks) {
        this.highPriorityTasks = highPriorityTasks;
    }

    public List<TaskResponse> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<TaskResponse> recentTasks) {
        this.recentTasks = recentTasks;
    }
}
