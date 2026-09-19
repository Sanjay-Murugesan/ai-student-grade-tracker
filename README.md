# AI Student Grade Tracker

AI Student Grade Tracker is a web-based student performance tracking system built using React, Spring Boot, MySQL, and AI prediction support. The system helps teachers manage students, assignments, submissions, grades, attendance, and performance insights. Students can view assignments, submit work, check grades, attendance, and AI-based performance predictions.
---



## Project Status

The project is currently in the online deployment and workflow improvement stage.

### Completed

- GitHub repository created and updated
- Backend deployed successfully on Railway
- MySQL database deployed successfully on Railway
- Backend connected with Railway MySQL
- Railway datasource configuration fixed
- Spring Boot backend running without crash
- Home endpoint added
- Health endpoint added
- Instructor login working
- Student login working
- Teacher dashboard working
- Student dashboard working
- Students page working and loading data
- Assignments page working and loading data
- Submissions page working and loading data
- Grades page working and loading data
- Add Grade workflow implemented
- Edit Grade and Delete Grade workflow code added
- Role-based restriction added
- Frontend connected with deployed backend API
- MySQL service optimized for low resource usage

### Pending

- Test Edit Grade and Delete Grade workflow fully
- Improve Attendance page with attendance percentage and low attendance warning
- Improve Course Analytics page with course-wise average, pass/fail count, and weak students
- Improve AI Insights page with rule-based student risk prediction
- Connect Submissions grading directly with Grades page
- Add demo data for presentation
- Improve UI design and responsiveness
- Deploy frontend online
- Deploy AI engine or add backend fallback AI
- Add final screenshots to README

---

## Main Purpose

The main purpose of this project is to help teachers and students track academic performance in a meaningful way.

The system does not only store marks. It helps answer important questions such as:

- How is each student performing?
- Which course is weak for a student?
- Which students are at academic risk?
- Is low attendance affecting performance?
- Which assignments are pending or poorly scored?
- What improvement suggestion can be given to the student?


Students belong to a department, year, semester, and section.
Instructors create assignments for a selected class and course.
Students can view only their own class assignments and their own grades.

---

## Core Workflow

```text
Course → Assignment → Submission → Grade → Attendance → Analytics → AI Prediction → AI Insights
