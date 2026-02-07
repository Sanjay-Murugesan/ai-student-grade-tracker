# 🔌 CONNECTION GUIDE - How Frontend Connects to Backend

## Overview

The Student Tracker application is a 3-tier architecture:

```
┌──────────────┐         HTTP          ┌──────────────┐         SQL          ┌──────────────┐
│   React UI   │ ◄──────Requests─────► │ Spring Boot  │ ◄──────Queries────► │    MySQL     │
│ localhost:   │         (Axios)       │ localhost:   │       (JDBC)        │ localhost:   │
│     3001     │                       │     8080     │                     │     3306     │
└──────────────┘                       └──────────────┘                     └──────────────┘
```

---

## Frontend to Backend Communication

### 1. **HTTP Requests (Frontend → Backend)**

The React frontend uses **Axios** to make HTTP requests to the Spring Boot backend.

**How it works:**
```javascript
// Example: Frontend API call
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;  // Returns student list
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

**Supported HTTP Methods:**
- GET - Retrieve data
- POST - Create data
- PUT - Update data
- DELETE - Delete data

### 2. **API Endpoints Available**

All endpoints return JSON format:

| Endpoint | Method | Description | Port |
|----------|--------|-------------|------|
| `/api/students` | GET | Get all students | 8080 |
| `/api/students/{id}` | GET | Get specific student | 8080 |
| `/api/grades` | GET | Get all grades | 8080 |
| `/api/assignments` | GET | Get all assignments | 8080 |
| `/api/courses` | GET | Get all courses | 8080 |
| `/api/users` | GET | Get all users | 8080 |

### 3. **Request/Response Flow**

#### Request (Frontend to Backend):
```
GET http://localhost:8080/api/students
```

#### Response (Backend to Frontend):
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "department": "Mathematics"
  }
]
```

---

## Backend to Database Communication

### 1. **Database Connection**

**Spring Boot connects to MySQL via:**

**File:** `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_tracker_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### 2. **Hibernte ORM (Object-Relational Mapping)**

Hibernate automatically maps Java objects to database tables.

**Example:**
```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String department;
}
```

This Java class automatically maps to the `students` table in MySQL.

### 3. **Database Tables**

| Table | Purpose | Created By |
|-------|---------|-----------|
| `students` | Student information | Hibernate |
| `grades` | Grade records | Hibernate |
| `assignments` | Assignment details | Hibernate |
| `courses` | Course information | Hibernate |
| `users` | User accounts | Hibernate |

---

## Complete Data Flow Example

### Scenario: Display all students on the frontend

```
1. USER ACTION
   └─ User clicks "View Students" button on React UI

2. FRONTEND (React)
   └─ axios.get('http://localhost:3001/api/students')
   └─ Sends GET request to backend API

3. NETWORK
   └─ HTTP GET request travels from port 3001 → port 8080

4. BACKEND (Spring Boot)
   ├─ Receives request at StudentController
   ├─ Calls StudentService.getAllStudents()
   └─ StudentService queries database via StudentRepository

5. DATABASE (MySQL)
   ├─ Executes: SELECT * FROM students
   ├─ Returns all student records
   └─ Hibernate converts SQL results to Java objects

6. BACKEND RESPONSE
   └─ Converts Java objects to JSON
   └─ Sends HTTP 200 OK with JSON array

7. NETWORK
   └─ HTTP response travels from port 8080 → port 3001

8. FRONTEND DISPLAY
   ├─ Receives JSON data
   ├─ Updates React state
   ├─ Re-renders component
   └─ Shows student list on UI
```

---

## Configuration for Frontend-Backend Connection

### Frontend API Service File

**Expected Location:** `frontend/student-tracker/src/services/`

**Example Configuration:**
```javascript
// src/services/apiClient.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

### Frontend Environment Variables

**File:** `frontend/student-tracker/.env`

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_BACKEND_URL=http://localhost:8080
```

---

## CORS (Cross-Origin Resource Sharing)

Since frontend (3001) and backend (8080) are on different ports, CORS headers are needed.

### Backend Configuration

**Spring Boot should allow CORS:**

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3001")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowCredentials(true);
            }
        };
    }
}
```

### Frontend Request Headers

Axios automatically adds:
```
Origin: http://localhost:3001
Content-Type: application/json
```

---

## Testing Connections

### 1. Test Backend is Running

```powershell
# Test if backend API responds
Invoke-RestMethod -Uri "http://localhost:8080/api/students" -Method Get

# Expected: [] or list of students
```

### 2. Test Frontend to Backend Connection

**In browser console (F12):**
```javascript
// Test fetch from frontend
fetch('http://localhost:8080/api/students')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3. Test Database Connection

```powershell
# Connect to MySQL
$env:PATH += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -proot student_tracker_db

# Check tables
SHOW TABLES;
SELECT COUNT(*) FROM students;
```

---

## Network Ports Overview

| Service | Port | Type | Used For |
|---------|------|------|----------|
| MySQL | 3306 | TCP | Database connection |
| Spring Boot | 8080 | HTTP | REST API |
| React Dev Server | 3001 | HTTP | Web UI |
| Live Reload | 35729 | WebSocket | Auto-refresh (dev only) |

---

## Troubleshooting Connection Issues

### Problem: Frontend shows "Connection Refused"

**Cause:** Backend not running on port 8080

**Solution:**
```powershell
# Check if backend is running
netstat -ano | findstr :8080

# If not running, start it:
cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\backend"
.\mvnw.cmd spring-boot:run
```

### Problem: CORS errors in browser console

**Cause:** Backend doesn't allow requests from port 3001

**Solution:**
1. Verify CORS config is enabled in backend
2. Restart backend: `Ctrl+C` then restart

### Problem: API returns 404 errors

**Cause:** Wrong endpoint path

**Solution:**
- Check endpoint path (e.g., `/api/students` not `/api/student`)
- Verify HTTP method (GET, POST, etc.)

### Problem: Database connection errors

**Cause:** MySQL not running or credentials wrong

**Solution:**
```powershell
# Start MySQL
Get-Service MySQL80 | Start-Service

# Test connection
$env:PATH += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -proot -e "SELECT 1;"
```

---

## Performance & Latency

### Expected Response Times

| Operation | Time | Notes |
|-----------|------|-------|
| API request | 50-100ms | Local network |
| Database query | 10-50ms | Simple queries |
| Round trip | 100-200ms | Frontend → Backend → Database |
| Page load | 1-3s | With all assets |

### Optimization Tips

1. **Enable gzip compression** in Spring Boot
2. **Add database indexes** for frequent queries
3. **Cache static assets** in frontend
4. **Implement pagination** for large datasets

---

## Security Considerations

⚠️ **For Development Only:**

### Current Setup:
- ✅ HTTP (not HTTPS)
- ✅ No authentication
- ✅ Default database credentials (root:root)
- ✅ CORS allows localhost:3001

### Before Production:
- [ ] Enable HTTPS
- [ ] Implement JWT authentication
- [ ] Change database password
- [ ] Restrict CORS to specific domains
- [ ] Add input validation
- [ ] Add SQL injection protection (Hibernate helps)

---

## Connection Checklist

Before launching, verify:

- [ ] MySQL running on port 3306
- [ ] Backend accessible at http://localhost:8080/api/students
- [ ] Frontend can reach backend (test in browser console)
- [ ] Database has tables created
- [ ] No CORS errors in browser console
- [ ] API responses are in JSON format

---

## Quick Reference

### Start Backend:
```powershell
cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\backend"
.\mvnw.cmd spring-boot:run
```

### Start Frontend:
```powershell
cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\frontend\student-tracker"
npm start
```

### Test Connection:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/students" -Method Get | ConvertTo-Json
```

### Check Database:
```powershell
$env:PATH += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -proot -e "SELECT DATABASE(); SHOW TABLES FROM student_tracker_db;"
```

---

## Summary

✅ **Frontend** connects to **Backend** via HTTP (Axios)
✅ **Backend** connects to **Database** via JDBC (Hibernate)
✅ **Data flows** both directions with JSON format
✅ **All ports** are separate and listening
✅ **CORS** is configured for cross-origin requests
✅ **No additional configuration** needed to run

**Everything is ready to use!** 🚀
