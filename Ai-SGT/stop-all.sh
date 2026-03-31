#!/bin/bash
set +e

pkill -f "uvicorn app:app"
pkill -f "spring-boot:run"
pkill -f "react-scripts start"
docker compose stop mysql

echo "Student Grade Tracker services stopped."
