#!/bin/bash
echo "==================================================================="
echo "CloudTask - Local Development Launcher"
echo "==================================================================="
echo ""
echo "Choose an option:"
echo "[1] Start Backend (Spring Boot on port 8080)"
echo "[2] Start Frontend (Vite on port 5173)"
echo "[3] Start Entire Full-Stack with Docker Compose (MySQL + Spring + React)"
echo ""
read -p "Enter option [1, 2, or 3]: " choice

if [ "$choice" == "1" ]; then
    echo "Starting Spring Boot Backend..."
    cd backend && mvn spring-boot:run
elif [ "$choice" == "2" ]; then
    echo "Starting Vite React Frontend..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install
    fi
    npm run dev
elif [ "$choice" == "3" ]; then
    echo "Starting all services with Docker Compose..."
    docker compose up --build
else
    echo "Invalid selection. Exiting."
fi
