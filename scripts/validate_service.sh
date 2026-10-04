#!/bin/bash
# ===================================================================
# CloudTask AWS CodeDeploy - ValidateService Hook
# ===================================================================
echo "Validating CloudTask service health..."

# Loop for up to 60 seconds checking the /api/health endpoint
for i in {1..12}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
    if [ "$response" == "200" ]; then
        echo "CloudTask Backend is UP and Healthy (HTTP 200)!"
        exit 0
    fi
    echo "Waiting for backend service to initialize (attempt $i/12)..."
    sleep 5
done

echo "Service health check failed!"
exit 1
