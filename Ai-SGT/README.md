# Student Grade Tracker

Student Grade Tracker is a placement-ready academic analytics platform with separate student and teacher workflows. The stack combines a React dashboard, a Spring Boot API secured with JWT and RBAC, a FastAPI prediction service, and MySQL-backed academic records.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, React Router, Axios, Recharts |
| Backend | Spring Boot, Spring Security, JPA, JWT |
| AI Service | FastAPI, scikit-learn, NumPy |
| Database | MySQL 8 |
| DevOps | Docker Compose, Bash startup scripts |

## Architecture

```text
[React Frontend :3000]
        |
        v
[Spring Boot API :8080] ---> [MySQL :3306]
        |
        v
[FastAPI AI Service :8000]
```

## Setup

### Prerequisites

- Java 17
- Maven 3.9+
- Node.js 18+
- Python 3.11+
- MySQL 8
- Docker Desktop (optional)

### Environment Setup

1. Create the MySQL schema: `student_tracker_db`
2. Update database credentials in [application.properties](/c:/Users/mssan/OneDrive/Desktop/Ai-SGT/Ai-SGT/backend/src/main/resources/application.properties)
3. Install frontend dependencies:
   `cd frontend/student-tracker && npm install`
4. Install AI dependencies:
   `cd ai-engine && pip install fastapi uvicorn numpy joblib scikit-learn`

### Run With Docker

1. `docker compose up --build`
2. Frontend: `http://localhost:3000`
3. Backend: `http://localhost:8080`
4. AI service: `http://localhost:8000`

### Run Manually

1. Start MySQL and ensure `student_tracker_db` exists
2. Start FastAPI:
   `cd ai-engine && uvicorn app:app --reload --port 8000`
3. Start Spring Boot:
   `cd backend && mvn spring-boot:run`
4. Start React:
   `cd frontend/student-tracker && npm start`

## API Documentation

| Method | Endpoint | Auth Required | Role | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Public | Register a student or teacher and receive JWT |
| POST | `/api/auth/login` | No | Public | Login and receive JWT |
| GET | `/api/students/me` | Yes | STUDENT | Get logged-in student profile |
| GET | `/api/students/dashboard` | Yes | STUDENT | Student KPI summary |
| GET | `/api/students/roster` | Yes | TEACHER | Teacher roster with AI risk metadata |
| GET | `/api/teacher/dashboard` | Yes | TEACHER | Teacher KPI summary |
| GET | `/api/grades/my` | Yes | STUDENT | Logged-in student grades |
| POST | `/api/grades/bulk` | Yes | TEACHER | Save grades in bulk |
| GET | `/api/assignments/my` | Yes | STUDENT | Student assignment view with status |
| PATCH | `/api/assignments/{id}/publish` | Yes | TEACHER | Publish draft assignment |
| GET | `/api/submissions/my` | Yes | STUDENT | Logged-in student submissions |
| GET | `/api/submissions/ungraded` | Yes | TEACHER | Ungraded submission count and list |
| PATCH | `/api/submissions/{id}/grade` | Yes | TEACHER | Grade a submission and persist score |
| GET | `/api/v1/courses` | Yes | Teacher-friendly legacy route | List courses |
| GET | `/api/ai/predict/{studentId}` | No | Internal/Public | Backend AI prediction passthrough |

## Demo Credentials

- Teacher: `teacher1@demo.com` / `teacher123`
- Student: `student1@demo.com` / `student123`

## Screenshots

- Student dashboard screenshot placeholder
- Teacher dashboard screenshot placeholder
- Roster and grading workflow screenshot placeholder
