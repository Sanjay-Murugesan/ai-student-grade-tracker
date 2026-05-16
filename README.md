# AI Student Grade Tracker

AI Student Grade Tracker is a web-based student performance tracking system built using React, Spring Boot, MySQL, and AI prediction support. The system helps teachers manage assignments, grades, attendance, and student performance insights. Students can view assignments, submit work, check grades, attendance, and AI-based performance predictions.

---

## Project Status

The project is currently in online deployment and workflow improvement stage.

### Completed

- GitHub repository created and updated
- Backend deployed on Railway
- MySQL database deployed on Railway
- Backend connected with Railway MySQL
- Home endpoint added
- Health endpoint added
- Student login working
- Student dashboard working
- Assignment page working
- Role-based restriction added
- MySQL service optimized for low resource usage

### Pending

- Fix frontend API URL for online backend
- Complete teacher and student workflow
- Add student list for teacher
- Add assignment submission workflow
- Add grading workflow
- Add demo data
- Improve UI design
- Deploy frontend online
- Deploy AI engine or add backend fallback AI

---

## Tech Stack

### Frontend

- React.js
- JavaScript
- CSS
- Axios
- React Router

### Backend

- Java
- Spring Boot
- Spring Data JPA
- REST API
- Maven

### Database

- MySQL
- Railway MySQL

### AI Engine

- FastAPI
- Python
- Machine Learning model

### Deployment

- Railway for backend
- Railway for MySQL
- GitHub for version control
- Frontend deployment pending

---

## Project Folder Structure

```text
ai-student-grade-tracker
│
├── Ai-SGT
│   ├── backend
│   │   ├── src/main/java/com/studenttracker/backend
│   │   │   ├── controller
│   │   │   ├── entity
│   │   │   ├── repository
│   │   │   ├── service
│   │   │   └── config
│   │   └── pom.xml
│   │
│   └── frontend
│       └── student-tracker
│           ├── src
│           │   ├── components
│           │   ├── pages
│           │   ├── services
│           │   └── App.js
│           └── package.json
│
├── ai-engine
│   ├── main.py
│   └── model files
│
└── README.md
