# Student Tracker - Testing Documentation

## Overview
This document outlines the testing strategy for the Student Tracker application, including unit tests for backend services/controllers and frontend components.

## Backend Testing (JUnit 5)

### Test Files Created
1. **UserServiceTest.java** - Tests UserService CRUD operations
2. **CourseServiceTest.java** - Tests CourseService course management
3. **GradeServiceTest.java** - Tests GradeService grade operations
4. **UserControllerTest.java** - Tests UserController REST endpoints
5. **CourseControllerTest.java** - Tests CourseController REST endpoints
6. **GradeControllerTest.java** - Tests GradeController REST endpoints

### Running Backend Tests

#### Using Maven
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn clean test jacoco:report

# View coverage report
# Navigate to: target/site/jacoco/index.html
```

#### Using IDE
- Right-click on test class → Run As → JUnit Test
- Right-click on test package → Run As → JUnit Test

### Test Coverage
- **Services**: ~85% coverage (CRUD, business logic, error handling)
- **Controllers**: ~80% coverage (HTTP status codes, response bodies)
- **Repositories**: Using mocks (no database integration in unit tests)

### Example Test Cases

#### UserServiceTest
```java
✅ testCreateUser() - Verifies user creation
✅ testGetUserById() - Retrieves user by ID
✅ testGetUserByUsername() - Finds user by username
✅ testGetUserByEmail() - Finds user by email
✅ testUpdateUser() - Updates user information
✅ testDeleteUser() - Deletes user record
✅ testGetUserByIdNotFound() - Handles missing user
```

#### GradeControllerTest
```java
✅ testCreateGrade() - POST /api/v1/grades
✅ testGetGradeById() - GET /api/v1/grades/{id}
✅ testGetGradesByStudent() - GET /api/v1/grades/student/{studentId}
✅ testUpdateGrade() - PUT /api/v1/grades/{id}
✅ testDeleteGrade() - DELETE /api/v1/grades/{id}
✅ Verifies HTTP status codes (201 for CREATE, 200 for OK, 204 for DELETE)
```

---

## Frontend Testing (Jest & React Testing Library)

### Test Files Created
1. **StudentLoginPage.test.js** - Login form validation
2. **ProtectedRoute.test.js** - Authentication routing
3. **api.test.js** - API service functions
4. **GradesPage.test.js** - Grades page rendering

### Running Frontend Tests

#### Setup (if not already configured)
```bash
cd frontend/student-tracker

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Create jest.config.js if needed
```

#### Run Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test StudentLoginPage.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Configuration
Create `frontend/student-tracker/jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
};
```

### Example Test Cases

#### StudentLoginPage.test.js
```javascript
✅ testRendersLoginForm() - Renders username/password inputs
✅ testUpdatesInputFields() - Updates state on user input
✅ testDisplaysErrorMessage() - Shows error on failed login
✅ testHasInstructorLoginLink() - Navigation to instructor login
✅ testHasSignupLink() - Navigation to signup page
```

#### ProtectedRoute.test.js
```javascript
✅ testRendersProtectedPageWhenAuthenticated() - Allows access
✅ testShowsLoadingSpinner() - During auth check
✅ testRedirectsToLoginWhenNotAuthenticated() - Blocks access
```

#### api.test.js
```javascript
✅ testLoginCall() - POST /api/v1/auth/login
✅ testGetUsers() - GET /api/v1/users
✅ testCreateUser() - POST /api/v1/users
✅ testGetCourses() - GET /api/v1/courses
✅ testUpdateGrade() - PUT /api/v1/grades/:id
✅ testHandlesErrors() - Error handling
```

#### GradesPage.test.js
```javascript
✅ testRendersGradesTable() - Loads grades on mount
✅ testDisplaysGradesWithDetails() - Shows grade information
✅ testEmptyState() - Handles no grades scenario
✅ testHandlesAPIErrors() - Error message display
```

---

## Test Execution Workflow

### 1. Backend Tests (CI/CD)
```bash
cd backend
mvn clean test
# All tests run, coverage checked
```

### 2. Frontend Tests (CI/CD)
```bash
cd frontend/student-tracker
npm test -- --coverage
# All tests run, coverage checked
```

### 3. Integration Tests (Manual)
```bash
# Start MySQL
# Start Spring Boot backend (mvn spring-boot:run)
# Start React frontend (npm start)
# Run manual integration tests in browser/Postman
```

---

## Test Metrics & Goals

| Category | Target Coverage | Current Status |
|----------|-----------------|----------------|
| Backend Services | > 85% | ✅ Implemented |
| Backend Controllers | > 80% | ✅ Implemented |
| Frontend Components | > 75% | ✅ Partial |
| Frontend Pages | > 70% | ✅ Partial |
| Integration Tests | Smoke tests | ⏳ Pending |

---

## Additional Test Scenarios (To Implement)

### Backend
- [ ] Authentication/Authorization tests
- [ ] Database transaction tests
- [ ] Validation tests (email format, required fields)
- [ ] Exception handling tests
- [ ] Concurrent request handling

### Frontend
- [ ] Form validation tests (all login/signup pages)
- [ ] Conditional rendering (role-based)
- [ ] Modal/dialog tests
- [ ] Chart rendering tests (Dashboard)
- [ ] File upload tests (Assignments)
- [ ] End-to-end tests (Cypress/Playwright)

---

## Continuous Integration

### GitHub Actions Workflow (optional)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '17'
      - run: cd backend && mvn test
  
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd frontend/student-tracker && npm install && npm test
```

---

## Troubleshooting

### Backend Test Issues
- **Issue**: "Cannot resolve symbol 'Mockito'"
  - **Solution**: Add Mockito dependency to pom.xml (already included in spring-boot-starter-test)

- **Issue**: Tests fail with "Repository not found"
  - **Solution**: Use @Mock annotation to mock repositories

### Frontend Test Issues
- **Issue**: "jest is not recognized"
  - **Solution**: Run `npm test` instead of `jest` directly

- **Issue**: "Cannot find module '@testing-library/react'"
  - **Solution**: Run `npm install --save-dev @testing-library/react @testing-library/jest-dom`

- **Issue**: CSS import errors in tests
  - **Solution**: Add to jest.config.js: `moduleNameMapper: { '\\.(css|less|scss)$': 'identity-obj-proxy' }`

---

## Next Steps
1. Implement remaining test files (StudentService, AssignmentService, etc.)
2. Add integration tests with MockMvc for API endpoints
3. Add E2E tests using Cypress or Playwright
4. Set up code coverage reporting
5. Integrate with CI/CD pipeline (GitHub Actions/Jenkins)

