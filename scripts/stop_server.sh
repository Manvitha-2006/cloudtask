#!/bin/bash
# ===================================================================
# CloudTask AWS CodeDeploy - ApplicationStop Hook
# ===================================================================
echo "Stopping previous instance of CloudTask..."

PID_FILE="/opt/cloudtask/backend/app.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Killing process $PID"
        kill -15 "$PID" || kill -9 "$PID"
    fi
    rm -f "$PID_FILE"
fi

echo "Previous instance stopped."
