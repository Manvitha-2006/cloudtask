# CloudTask - Full-Stack Task Management System

> **College Project Title:** AWS CI/CD Pipeline using CodePipeline with Blue-Green Deployment  
> **Application:** CloudTask Management System  
> **Tech Stack:** React (Vite) + Spring Boot (Java 17) + MySQL 8.0  

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Architecture & Setup](#database-architecture--setup)
6. [Backend Setup & Execution](#backend-setup--execution)
7. [Frontend Setup & Execution](#frontend-setup--execution)
8. [Running with Docker Compose](#running-with-docker-compose)
9. [REST API Documentation](#rest-api-documentation)
10. [Frontend-to-Backend Integration](#frontend-to-backend-integration)
11. [Environment Variables](#environment-variables)
12. [AWS CI/CD Pipeline & Blue-Green Deployment](#aws-cicd-pipeline--blue-green-deployment)
13. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🌟 Project Overview

**CloudTask** is a production-grade full-stack task management web application built for college project demonstration and designed to be deployed through an **AWS CI/CD Pipeline with Blue-Green Deployment**.

The application allows users to register, authenticate securely, and manage tasks across three status phases (**TODO**, **IN_PROGRESS**, **COMPLETED**) with designated priority levels (**LOW**, **MEDIUM**, **HIGH**). It provides an interactive dashboard with live metrics, search and multi-criteria filtering, task lifecycle editing, and user profile management.

---

## ✨ Key Features

### 1. Authentication & Security
- **User Registration**: Create accounts with name, email, and password.
- **Secure Login**: Password encryption using Spring Security's `BCryptPasswordEncoder`.
- **Stateless Authorization**: JWT (JSON Web Token) generation and verification via `JwtFilter`.
- **Multi-Tenant Isolation**: Users only see and manage their own tasks.

### 2. Dashboard Analytics
- **Live Metric Cards**:
  - Total Tasks
  - Pending Tasks (`TODO`)
  - In Progress Tasks (`IN_PROGRESS`)
  - Completed Tasks (`COMPLETED`)
  - High Priority Tasks (`HIGH`)
- **Recent Tasks Feed**: Direct access to newly created items with inline status toggling.

### 3. Task Management
- **Create Tasks**: Title, multi-line description, priority, and initial status.
- **View & Filter**: Search by keyword in title/description; filter by Status and Priority.
- **Detailed View**: View individual task metadata, timestamps (`createdAt`, `updatedAt`), and creator details.
- **Edit Tasks**: Update title, description, priority, or status anytime.
- **Delete Tasks**: Safe deletion protected by a confirmation modal dialog.
- **Quick Status Toggle**: Instantly progress tasks from dropdowns without leaving the current view.

### 4. User Profile
- View personal details, total tasks authored, account creation timestamp, and AWS deployment architecture.
- Secure sign-out with token invalidation.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React.js (v18.2) with Vite 5
- **Routing**: React Router DOM (v6.22)
- **HTTP Client**: Axios (v1.6) with request/response interceptors
- **Icons**: Lucide React
- **Styling**: Vanilla CSS3 with custom Design System tokens (Glassmorphism, CSS Grid, Micro-animations)

### Backend
- **Platform**: Java 17
- **Framework**: Spring Boot 3.2.5
- **Persistence**: Spring Data JPA & Hibernate
- **Security**: Spring Security 6 with BCrypt & JJWT (JSON Web Token 0.11.5)
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`, etc.)
- **Build Tool**: Apache Maven

### Database
- **Database Engine**: MySQL 8.0+
- **Driver**: MySQL Connector/J

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Web Server / Reverse Proxy**: Nginx
- **AWS CI/CD**: AWS CodePipeline, AWS CodeBuild (`buildspec.yml`), AWS CodeDeploy (`appspec.yml`)
- **Deployment Strategy**: Blue-Green Deployment (Zero-Downtime)

---

## 📂 Project Structure

```text
cloudtask/
│
├── frontend/                              # React + Vite Frontend
│   ├── public/
│   │   ├── favicon.svg                   # Brand favicon
│   │   └── index.html
│   ├── src/
│   │   ├── components/                   # 9 Reusable UI Components
│   │   │   ├── Button.jsx                # Multi-variant button with loading state
│   │   │   ├── ConfirmModal.jsx          # Modal confirmation dialog
│   │   │   ├── DashboardCard.jsx         # Summary metrics card
│   │   │   ├── ErrorAlert.jsx            # Alert banners for feedback
│   │   │   ├── LoadingSpinner.jsx        # Spinners & loading views
│   │   │   ├── Navbar.jsx                # Top navigation header
│   │   │   ├── ProtectedRoute.jsx        # React Router auth guard
│   │   │   ├── Sidebar.jsx               # Navigation sidebar
│   │   │   ├── TaskCard.jsx              # Task grid card
│   │   │   └── TaskForm.jsx              # Reusable create/edit task form
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global user authentication state
│   │   ├── pages/                        # 8 Core Application Pages
│   │   │   ├── AddTask.jsx               # Create new task
│   │   │   ├── Dashboard.jsx             # Metrics & recent tasks
│   │   │   ├── EditTask.jsx              # Edit existing task
│   │   │   ├── Login.jsx                 # User sign-in
│   │   │   ├── Profile.jsx               # User profile & CI/CD info
│   │   │   ├── Register.jsx              # New user sign-up
│   │   │   ├── TaskDetails.jsx           # Single task detailed view
│   │   │   └── Tasks.jsx                 # Task list with search & filters
│   │   ├── services/
│   │   │   ├── api.js                    # Axios instance with interceptors
│   │   │   ├── authService.js            # Auth API integration
│   │   │   └── taskService.js            # Tasks CRUD API integration
│   │   ├── styles/
│   │   │   ├── index.css                 # CSS variables, typography, resets
│   │   │   ├── components.css            # Component-specific styles
│   │   │   └── App.css                   # Layouts and view styling
│   │   ├── App.jsx                       # Main application router
│   │   └── main.jsx                      # React DOM entry point
│   ├── Dockerfile                        # Frontend production build
│   ├── nginx.conf                        # Nginx reverse proxy configuration
│   ├── package.json                      # Frontend dependencies
│   ├── vite.config.js                    # Vite configuration
│   ├── .env                              # Local environment variables
│   └── .env.example                      # Sample frontend env variables
│
├── backend/                               # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cloudtask/
│   │   │   │   ├── CloudTaskApplication.java # Spring Boot Main Class
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java   # Cross-Origin Resource Sharing
│   │   │   │   │   ├── GlobalExceptionHandler.java # REST Error Handler
│   │   │   │   │   ├── JwtFilter.java    # Bearer token request filter
│   │   │   │   │   ├── JwtUtil.java      # Token generation and signing
│   │   │   │   │   └── SecurityConfig.java# Spring Security 6 config
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java   # /api/auth endpoints
│   │   │   │   │   ├── HealthController.java # /api/health (ALB checks)
│   │   │   │   │   └── TaskController.java   # /api/tasks endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── DashboardStatsResponse.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── TaskRequest.java
│   │   │   │   │   ├── TaskResponse.java
│   │   │   │   │   └── UserResponse.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Priority.java     # LOW, MEDIUM, HIGH
│   │   │   │   │   ├── Task.java         # Task JPA entity
│   │   │   │   │   ├── TaskStatus.java   # TODO, IN_PROGRESS, COMPLETED
│   │   │   │   │   └── User.java         # User JPA entity
│   │   │   │   ├── repository/
│   │   │   │   │   ├── TaskRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   └── service/
│   │   │   │       ├── AuthService.java  # Registration & Authentication
│   │   │   │       └── TaskService.java  # Task Business Logic
│   │   │   └── resources/
│   │   │       ├── application.properties# DB and JWT configuration
│   │   │       └── schema.sql            # MySQL schema DDL
│   │   └── test/
│   ├── Dockerfile                         # Backend container build
│   ├── pom.xml                            # Maven project descriptor
│   └── .env.example                       # Sample backend env variables
│
├── scripts/                               # AWS CodeDeploy Lifecycle Hooks
│   ├── before_install.sh
│   ├── start_server.sh
│   ├── stop_server.sh
│   └── validate_service.sh
│
├── appspec.yml                            # AWS CodeDeploy deployment spec
├── buildspec.yml                          # AWS CodeBuild build spec
├── docker-compose.yml                     # Multi-container orchestration
├── run-local.bat                          # One-click Windows launch script
├── run-local.sh                           # One-click Unix launch script
└── README.md                              # Complete Project Guide
```

---

## 🗄 Database Architecture & Setup

### 1. Database Schema
CloudTask uses MySQL 8.0. The schema is automatically created or verified by Hibernate on startup (`spring.jpa.hibernate.ddl-auto=update`), or can be executed manually from `backend/src/main/resources/schema.sql`.

#### `users` Table
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique User Identifier |
| `name` | VARCHAR(100) | NOT NULL | User's Full Name |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | User Login Email |
| `password` | VARCHAR(255) | NOT NULL | BCrypt Hashed Password |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account Registration Time |

#### `tasks` Table
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique Task Identifier |
| `title` | VARCHAR(200) | NOT NULL | Task Title |
| `description` | TEXT | NULL | Detailed Task Instructions |
| `priority` | VARCHAR(20) | NOT NULL, DEFAULT 'MEDIUM' | `LOW`, `MEDIUM`, `HIGH` |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'TODO' | `TODO`, `IN_PROGRESS`, `COMPLETED` |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Task Creation Timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last Modified Timestamp |
| `user_id` | BIGINT | NOT NULL, FOREIGN KEY (users.id) | Task Creator Reference |

### 2. Manual MySQL Setup (Local)
If you already have MySQL installed locally:

```sql
-- 1. Log in to MySQL CLI:
mysql -u root -p

-- 2. Create the database:
CREATE DATABASE IF NOT EXISTS cloudtask_db;

-- 3. Verify:
SHOW DATABASES;
```

---

## ⚙️ Backend Setup & Execution

### Prerequisites
- **Java Development Kit (JDK)**: Version 17 or higher
- **Maven**: Version 3.8+ (or use an IDE such as IntelliJ IDEA / Eclipse / VS Code)
- **MySQL**: Running on port 3306

### Step-by-Step Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables (optional if using defaults `root` with empty password):
   Create a `.env` file or export your environment variables:
   ```bash
   # Windows (Command Prompt)
   set DB_HOST=localhost
   set DB_PORT=3306
   set DB_NAME=cloudtask_db
   set DB_USERNAME=root
   set DB_PASSWORD=your_password

   # Windows (PowerShell)
   $env:DB_HOST="localhost"
   $env:DB_PORT="3306"
   $env:DB_NAME="cloudtask_db"
   $env:DB_USERNAME="root"
   $env:DB_PASSWORD="your_password"

   # Linux / macOS
   export DB_HOST=localhost
   export DB_PORT=3306
   export DB_NAME=cloudtask_db
   export DB_USERNAME=root
   export DB_PASSWORD=your_password
   ```

3. Build and run the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```

4. Verify that the backend is running:
   Open your browser or run:
   ```bash
   curl http://localhost:8080/api/health
   ```
   **Expected Response:**
   ```json
   {
     "application": "CloudTask",
     "environment": "AWS CI/CD Blue-Green Deployment Ready",
     "status": "UP",
     "timestamp": "2026-10-04T10:00:00"
   }
   ```

---

## 💻 Frontend Setup & Execution

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher

### Step-by-Step Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify environment configuration:
   The `frontend/.env` file contains:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Access the application:
   Open your browser at `http://localhost:5173`.

---

## 🐳 Running with Docker Compose (Recommended)

Run the full stack (**MySQL Database + Spring Boot Backend + React Frontend**) with a single command without installing Java or MySQL locally:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8080`
- **MySQL Database**: `localhost:3306`

To shut down:
```bash
docker compose down -v
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:8080/api`

### 1. Authentication Endpoints

#### `POST /api/auth/register`
Creates a new user account.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Sasank Kumar",
    "email": "sasank@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "id": 1,
      "name": "Sasank Kumar",
      "email": "sasank@example.com",
      "message": "Registration successful"
    }
  }
  ```

#### `POST /api/auth/login`
Authenticates a user and returns a JWT token.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "sasank@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "id": 1,
      "name": "Sasank Kumar",
      "email": "sasank@example.com",
      "message": "Login successful"
    }
  }
  ```

#### `GET /api/auth/profile`
Retrieves authenticated user profile and aggregate task count.
- **Request Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User profile fetched",
    "data": {
      "id": 1,
      "name": "Sasank Kumar",
      "email": "sasank@example.com",
      "createdAt": "2026-10-04T09:30:00",
      "totalTasks": 12
    }
  }
  ```

---

### 2. Task Management Endpoints

> **Note:** All task endpoints require the header `Authorization: Bearer <token>`.

#### `GET /api/tasks`
Fetches tasks for the logged-in user with optional query filters.
- **Query Parameters**:
  - `status` (optional): `TODO`, `IN_PROGRESS`, `COMPLETED`
  - `priority` (optional): `LOW`, `MEDIUM`, `HIGH`
  - `search` (optional): Substring search on title and description
- **Example**: `GET /api/tasks?status=IN_PROGRESS&priority=HIGH`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Tasks fetched successfully",
    "data": [
      {
        "id": 101,
        "title": "Configure AWS CodePipeline",
        "description": "Connect GitHub repository to CodeBuild stage",
        "priority": "HIGH",
        "status": "IN_PROGRESS",
        "createdAt": "2026-10-04T10:15:00",
        "updatedAt": "2026-10-04T11:00:00",
        "userId": 1,
        "userName": "Sasank Kumar"
      }
    ]
  }
  ```

#### `GET /api/tasks/{id}`
Fetches full details for a specific task.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task fetched successfully",
    "data": {
      "id": 101,
      "title": "Configure AWS CodePipeline",
      "description": "Connect GitHub repository to CodeBuild stage",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "createdAt": "2026-10-04T10:15:00",
      "updatedAt": "2026-10-04T11:00:00",
      "userId": 1,
      "userName": "Sasank Kumar"
    }
  }
  ```

#### `POST /api/tasks`
Creates a new task.
- **Request Body**:
  ```json
  {
    "title": "Set up Blue-Green Deployment Groups",
    "description": "Configure port 80 target group and test port 8080",
    "priority": "HIGH",
    "status": "TODO"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "id": 102,
      "title": "Set up Blue-Green Deployment Groups",
      "description": "Configure port 80 target group and test port 8080",
      "priority": "HIGH",
      "status": "TODO",
      "createdAt": "2026-10-04T12:00:00",
      "updatedAt": "2026-10-04T12:00:00",
      "userId": 1,
      "userName": "Sasank Kumar"
    }
  }
  ```

#### `PUT /api/tasks/{id}`
Updates an existing task.
- **Request Body**:
  ```json
  {
    "title": "Set up Blue-Green Deployment Groups",
    "description": "Target groups configured and attached to ALB",
    "priority": "HIGH",
    "status": "COMPLETED"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "data": {
      "id": 102,
      "title": "Set up Blue-Green Deployment Groups",
      "description": "Target groups configured and attached to ALB",
      "priority": "HIGH",
      "status": "COMPLETED",
      "createdAt": "2026-10-04T12:00:00",
      "updatedAt": "2026-10-04T12:45:00",
      "userId": 1,
      "userName": "Sasank Kumar"
    }
  }
  ```

#### `DELETE /api/tasks/{id}`
Permanently deletes a task.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": null
  }
  ```

#### `GET /api/tasks/dashboard`
Fetches metrics and the 5 most recent tasks for the logged-in user.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Dashboard stats fetched successfully",
    "data": {
      "totalTasks": 8,
      "pendingTasks": 3,
      "inProgressTasks": 2,
      "completedTasks": 3,
      "highPriorityTasks": 2,
      "recentTasks": [...]
    }
  }
  ```

---

## 🔗 Frontend-to-Backend Integration

The React frontend communicates with the Spring Boot backend using **Axios** with the following architecture:

```text
[ Browser / React App ]
         │
         ▼
[ src/services/api.js (Axios Instance) ]
         │
         ├─ Request Interceptor: Reads `cloudtask_token` from localStorage
         │                       Appends `Authorization: Bearer <token>`
         │
         ├─ Base URL: `import.meta.env.VITE_API_URL` (default: http://localhost:8080/api)
         │
         ▼
[ Spring Boot Backend: port 8080 ]
         │
         ├─ CorsConfig: Allows React Origin (http://localhost:5173 / localhost:3000)
         ├─ JwtFilter: Parses Bearer token & authenticates User Principal
         ├─ Controllers: Dispatches to TaskController / AuthController
         └─ Response: JSON with ApiResponse<T> wrapper
         │
         ▼
[ src/services/api.js (Response Interceptor) ]
         │
         ├─ Success: Unwraps response.data
         └─ Error 401: Clears invalid token and redirects to /login?expired=true
```

---

## 🔐 Environment Variables

### Backend (`backend/.env` or system variables)
| Variable | Default Value | Description |
|---|---|---|
| `DB_HOST` | `localhost` | MySQL host address |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `cloudtask_db` | Database schema name |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | *(empty)* | Database password |
| `JWT_SECRET` | *(256-bit default)* | Secret key for signing JWTs |
| `JWT_EXPIRATION_MS`| `604800000` | Token validity duration (7 days) |

### Frontend (`frontend/.env`)
| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | Full URL to Spring Boot API |

---

## 🚀 AWS CI/CD Pipeline & Blue-Green Deployment

This project includes all required files for automated build and zero-downtime deployment on AWS:

```text
                AWS CI/CD PIPELINE FLOW
               =========================

   [ Developer Push to Git ]
              │
              ▼
   [ AWS CodePipeline ]
              │
              ▼
   [ AWS CodeBuild (buildspec.yml) ]
      - Installs Java 17 & Node.js 20
      - Compiles backend jar (`mvn clean package`)
      - Builds frontend bundle (`npm run build`)
      - Packages artifacts with appspec.yml & lifecycle scripts
              │
              ▼
   [ AWS CodeDeploy (appspec.yml) ]
      - Blue-Green Deployment Strategy
      - Deploys new revision to GREEN environment
      - Runs Lifecycle Hooks:
          1. scripts/before_install.sh
          2. scripts/start_server.sh
          3. scripts/validate_service.sh (/api/health check)
              │
              ▼
   [ Application Load Balancer (ALB) ]
      - Traffic shifted from BLUE fleet to GREEN fleet
      - ZERO downtime for end users
      - Automatic rollback if /api/health fails
```

### Deployment Configuration Files Included:
1. **`buildspec.yml`**: AWS CodeBuild commands for Java 17 and Node.js 20.
2. **`appspec.yml`**: AWS CodeDeploy hooks and target path mappings.
3. **`scripts/before_install.sh`**: Prepares directories and purges previous jars.
4. **`scripts/start_server.sh`**: Starts the Spring Boot jar and reloads Nginx.
5. **`scripts/validate_service.sh`**: Tests HTTP 200 on `/api/health`.
6. **`scripts/stop_server.sh`**: Safely stops previous application instances.

---

## ❓ Troubleshooting Guide

1. **MySQL Access Denied or Connection Refused**:
   - Ensure MySQL service is running (`systemctl status mysql` or via Services on Windows).
   - Verify credentials in `backend/.env` match your MySQL setup.
   - If using Docker, ensure port 3306 is not occupied by another MySQL instance.

2. **CORS Error in Browser Console**:
   - The backend `CorsConfig.java` allows `http://localhost:5173` and `http://localhost:3000`.
   - Ensure you are accessing the frontend via `http://localhost:5173` or `http://localhost:3000`.

3. **Port 8080 Already in Use**:
   - Modify `server.port=8081` in `application.properties` and update `VITE_API_URL=http://localhost:8081/api` in `frontend/.env`.
