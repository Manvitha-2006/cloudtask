@echo off
echo ===================================================================
echo CloudTask - Local Development Launcher
echo ===================================================================
echo.
echo Choose an option:
echo [1] Start Backend (Spring Boot on port 8080)
echo [2] Start Frontend (Vite on port 5173)
echo [3] Start Entire Full-Stack with Docker Compose (MySQL + Spring + React)
echo.
set /p choice="Enter option [1, 2, or 3]: "

if "%choice%"=="1" (
    echo Starting Spring Boot Backend...
    cd backend
    mvn spring-boot:run
) else if "%choice%"=="2" (
    echo Starting Vite React Frontend...
    cd frontend
    if not exist node_modules (
        echo Installing npm dependencies...
        npm install
    )
    npm run dev
) else if "%choice%"=="3" (
    echo Starting all services with Docker Compose...
    docker compose up --build
) else (
    echo Invalid selection. Exiting.
)
pause
