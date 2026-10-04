#!/bin/bash
# ===================================================================
# CloudTask AWS CodeDeploy - BeforeInstall Hook
# ===================================================================
echo "Preparing deployment directories..."

# Create target directories if they don't exist
mkdir -p /opt/cloudtask/backend
mkdir -p /var/www/cloudtask/html
mkdir -p /var/log/cloudtask

# Clean up old temporary files
rm -rf /opt/cloudtask/backend/*.jar
rm -rf /var/www/cloudtask/html/*
