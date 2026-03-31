#!/bin/bash
set -e

echo "Checking MySQL..."
docker compose up -d mysql

echo "Starting AI service..."
(cd ai-engine && nohup uvicorn app:app --host 0.0.0.0 --port 8000 > ../ai-service.log 2>&1 &)

echo "Starting Spring Boot backend..."
(cd backend && nohup mvn spring-boot:run > ../backend.log 2>&1 &)

echo "Starting React frontend..."
(cd frontend/student-tracker && nohup npm start > ../../frontend.log 2>&1 &)

echo "Student Grade Tracker services are launching:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "AI API:   http://localhost:8000"
echo "MySQL:    localhost:3306"
