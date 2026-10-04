#!/bin/bash
# ===================================================================
# CloudTask AWS CodeDeploy - ApplicationStart Hook
# ===================================================================
echo "Starting CloudTask Spring Boot Backend and Nginx..."

cd /opt/cloudtask/backend

# Run Spring Boot jar in background with environment variables
nohup java -jar -Dspring.profiles.active=prod cloudtask-backend-1.0.0.jar > /var/log/cloudtask/backend.log 2>&1 &

echo $! > /opt/cloudtask/backend/app.pid

# Reload Nginx to serve the new frontend static bundle
systemctl reload nginx || systemctl restart nginx

echo "Services started successfully."
