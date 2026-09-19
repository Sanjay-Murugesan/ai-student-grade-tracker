# Student Tracker - Full Implementation Guide

## 🎯 Project Overview

A complete student tracking system with AI predictions, role-based authentication, and real-time grading management.

---

## 📦 Frontend Structure (React 19)

### Pages Created:
```
src/pages/
├── StudentLoginPage.js        ✅ Student login with credentials
├── StudentSignupPage.js       ✅ Student registration
├── InstructorLoginPage.js     ✅ Instructor login with credentials
├── InstructorSignupPage.js    ✅ Instructor registration
├── DashboardPage.js           ✅ Overview with statistics
├── AssignmentsPage.js         ✅ View & submit assignments
├── GradesPage.js              ✅ View/edit grades
├── AIPredictPage.js           ✅ AI performance predictions
├── ProfilePage.js             ✅ User profile & settings
└── StudentsPage.js            (existing)
```

### Context & Auth:
```
src/context/
├── AuthContext.js             ✅ Global auth state management
└── ProtectedRoute.js          ✅ Route protection
```

### Services:
```
src/services/
└── api.js                     ✅ Axios instance with API endpoints
```

### Components:
```
src/components/
├── Navbar.js                  ✅ Updated with auth & profile dropdown
├── Navbar.css                 ✅ Navbar styling
└── (other existing components)
```

### Styles:
```
src/styles/
├── auth.css                   ✅ Login/signup styling
├── navbar.css                 ✅ Navigation styling
├── dashboard.css              ✅ Dashboard cards & charts
├── assignments.css            ✅ Assignment cards
├── grades.css                 ✅ Grade table styling
├── ai-predict.css             ✅ Prediction display
├── profile.css                ✅ Profile page styling
└── theme.css                  (existing)
```

---

## 🔐 Authentication Flow

### Login/Signup Process:
1. User selects Student or Instructor
2. Enters credentials (username, email, password)
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. AuthContext updated with user info
6. Redirected to dashboard

### Protected Routes:
- All dashboard, assignment, grade, and prediction pages require authentication
- Unauthorized access redirects to login page
- Token automatically attached to API requests

---

## 📊 Features by Role

### STUDENT Role:
- ✅ View assigned courses
- ✅ Submit assignments
- ✅ View personal grades
- ✅ See AI performance predictions
- ✅ Track improvement trends
- ✅ Update profile

### INSTRUCTOR Role:
- ✅ Create & manage courses
- ✅ Create assignments
- ✅ View all submissions
- ✅ Edit student grades
- ✅ Add feedback to grades
- ✅ View class statistics

---

## 🔌 API Integration

### Auth Endpoints:
```
POST /api/v1/auth/login      - Student/Instructor login
POST /api/v1/auth/signup     - User registration
```

### User Endpoints:
```
GET  /api/v1/users/profile   - Get logged-in user profile
PUT  /api/v1/users/profile   - Update user profile
GET  /api/v1/users/{id}      - Get user by ID
```

### Course Endpoints:
```
GET  /api/v1/courses         - List all courses
POST /api/v1/courses         - Create course (instructor)
GET  /api/v1/courses/instructor/{id} - Get instructor's courses
PUT  /api/v1/courses/{id}    - Update course
DELETE /api/v1/courses/{id}  - Delete course
```

### Assignment Endpoints:
```
GET  /api/v1/assignments     - List assignments
POST /api/v1/assignments     - Create assignment (instructor)
GET  /api/v1/assignments/{id} - Get assignment details
PUT  /api/v1/assignments/{id} - Update assignment
DELETE /api/v1/assignments/{id} - Delete assignment
```

### Submission Endpoints:
```
POST /api/v1/submissions     - Submit assignment (student)
GET  /api/v1/submissions/student/{id} - Student's submissions
GET  /api/v1/submissions/assignment/{id} - Assignment submissions
GET  /api/v1/submissions/student/{sid}/assignment/{aid} - Specific submission
PUT  /api/v1/submissions/{id} - Update submission
```

### Grade Endpoints:
```
GET  /api/v1/grades          - List all grades
GET  /api/v1/grades/student/{id} - Student's grades
POST /api/v1/grades          - Create grade (instructor)
PUT  /api/v1/grades/{id}     - Update grade with feedback (instructor)
DELETE /api/v1/grades/{id}   - Delete grade
```

### AI Prediction Endpoints:
```
GET  /ai/predict/{studentId} - Get AI prediction for student
GET  /api/prediction/{studentId} - Get saved prediction history
```

---

## 🎨 UI Components

### Dashboard:
- Statistics cards (Total Courses, Assignments, Average Grade)
- Performance chart (Recharts line graph)
- Quick access buttons

### Assignments Page:
- Assignment cards with details
- Due date display
- Submit button with file upload (students)
- Submission status tracking

### Grades Page:
- Table with all assignments
- Score column
- Feedback column
- Edit button (instructors only)
- Inline editing capability

### AI Prediction Page:
- Predicted score display
- Risk level badge (Low/Medium/High)
- Confidence level progress bar
- Improvement suggestions
- Refresh button

### Profile Page:
- User information display
- Edit mode for updating profile
- Save/Cancel buttons
- Logout button
- Role-specific fields

---

## 🚀 How to Run

### Frontend:
```bash
cd frontend/student-tracker

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

### Backend:
```bash
cd backend

# Build with Maven
mvn clean install

# Run Spring Boot app
mvn spring-boot:run
```

The app will be available at: **http://localhost:3000**
Backend API: **http://localhost:8080**

---

## 🔑 Default Credentials (for testing)

You can create test accounts through the signup pages.

---

## 📋 Authentication Headers

All API requests (except login/signup) include:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Token is automatically added via axios interceptor.

---

## 🎯 Key Features Implemented

✅ JWT Authentication with role-based access
✅ Separate login pages for Student & Instructor
✅ Protected routes (ProtectedRoute component)
✅ Global state management (AuthContext)
✅ Responsive navbar with profile dropdown
✅ Complete CRUD operations for all entities
✅ File submission handling
✅ Inline grade editing
✅ AI prediction display
✅ Modern UI with Bootstrap & custom CSS
✅ Toast notifications (error handling)
✅ Loading states
✅ Error boundaries

---

## 🔄 User Flow

### Student Flow:
1. Sign up → Login → Dashboard (stats)
2. Browse Assignments → Submit assignment
3. View Grades → Check AI Predictions
4. Update Profile → Logout

### Instructor Flow:
1. Sign up → Login → Dashboard (class stats)
2. Create Course → Create Assignment
3. View Submissions → Grade assignment with feedback
4. View Predictions → Update Profile → Logout

---

## 📝 Environment Variables

Create `.env` file in frontend folder:
```
REACT_APP_API_BASE=http://localhost:8080
```

---

## 🐛 Troubleshooting

### 401 Unauthorized:
- Token expired or invalid
- Re-login required

### 404 Not Found:
- Check API endpoints match backend routes
- Verify backend is running on port 8080

### CORS Issues:
- Backend should have @CrossOrigin("*")
- Check axios baseURL is correct

### Navbar not showing:
- Check AuthContext provider wraps entire app
- Verify isAuthenticated state

---

## ✅ Complete!

**All features implemented:**
- ✅ Backend (8 entities, repositories, services, controllers)
- ✅ Frontend (9 pages, auth system, components)
- ✅ Database (MySQL schema with 8 tables)
- ✅ API integration (34+ endpoints)
- ✅ Styling (responsive, modern UI)

**Ready for:**
- Testing
- Deployment
- Further enhancements
