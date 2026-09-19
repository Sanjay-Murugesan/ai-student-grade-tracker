# Test Execution Guide

## Quick Start

### Backend Tests (JUnit 5)

**Run all backend tests:**
```bash
cd backend
mvn clean test
```

**Run specific test class:**
```bash
mvn test -Dtest=UserServiceTest
```

**Run tests with coverage report:**
```bash
mvn clean test jacoco:report
# View report at: target/site/jacoco/index.html
```

**Run tests for a specific package:**
```bash
mvn test -Dtest=com/studenttracker/backend/service/*
```

---

### Frontend Tests (Jest)

**Install dependencies (first time only):**
```bash
cd frontend/student-tracker
npm install
```

**Run all frontend tests:**
```bash
npm test -- --watchAll=false
```

**Run specific test file:**
```bash
npm test StudentLoginPage.test.js -- --watchAll=false
```

**Run tests with coverage:**
```bash
npm test -- --coverage --watchAll=false
```

**Run tests in watch mode (auto-rerun on file changes):**
```bash
npm test
```

---

### Combined Test Execution

**Windows (PowerShell):**
```powershell
.\run-tests.bat
```

**Linux/Mac (Bash):**
```bash
chmod +x run-tests.sh
./run-tests.sh
```

---

## Test Files Summary

### Backend (Java/JUnit)

| Test File | Location | Coverage |
|-----------|----------|----------|
| UserServiceTest | `backend/src/test/java/.../service/` | 8 test cases |
| CourseServiceTest | `backend/src/test/java/.../service/` | 6 test cases |
| GradeServiceTest | `backend/src/test/java/.../service/` | 7 test cases |
| StudentServiceTest | `backend/src/test/java/.../service/` | 7 test cases |
| AssignmentServiceTest | `backend/src/test/java/.../service/` | 8 test cases |
| UserControllerTest | `backend/src/test/java/.../controller/` | 6 test cases |
| CourseControllerTest | `backend/src/test/java/.../controller/` | 5 test cases |
| GradeControllerTest | `backend/src/test/java/.../controller/` | 5 test cases |

**Total Backend Tests: 52 test cases**

### Frontend (JavaScript/Jest)

| Test File | Location | Coverage |
|-----------|----------|----------|
| StudentLoginPage.test.js | `frontend/student-tracker/src/pages/` | 5 test cases |
| ProtectedRoute.test.js | `frontend/student-tracker/src/` | 3 test cases |
| api.test.js | `frontend/student-tracker/src/services/` | 9 test cases |
| GradesPage.test.js | `frontend/student-tracker/src/pages/` | 4 test cases |

**Total Frontend Tests: 21 test cases**

---

## Interpreting Test Results

### Maven Output
```
[INFO] Building project...
[INFO] Running UserServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.234 s
[INFO] BUILD SUCCESS
```

### Jest Output
```
PASS  src/StudentLoginPage.test.js
  ✓ renders login form with username and password fields (45ms)
  ✓ updates input fields on user input (28ms)
  ✓ displays error message on failed login (156ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

---

## Troubleshooting

### Backend Issues

**"Tests are not found"**
- Ensure test files are in `src/test/java` directory
- Check package names match source package structure
- Run: `mvn clean test`

**"MockitoExtension not found"**
- Check pom.xml has junit-jupiter-api and mockito dependencies
- These are included in spring-boot-starter-test

**Build fails before tests run**
- Run: `mvn clean compile` first
- Check for Java version compatibility (Java 17 required)

### Frontend Issues

**"jest command not found"**
- Run from `frontend/student-tracker` directory
- Use: `npm test` instead of `jest` directly

**"Cannot find module"**
- Run: `npm install` to install dependencies
- Check node_modules folder exists

**Tests hang or timeout**
- Add timeout: `npm test -- --testTimeout=10000`
- Check for infinite loops in tested code

---

## Coverage Reports

### Backend Coverage
```bash
mvn clean test jacoco:report
# Opens at: target/site/jacoco/index.html
# Shows: line coverage, branch coverage, method coverage
```

### Frontend Coverage
```bash
npm test -- --coverage --watchAll=false
# Displays in terminal:
# File      | Statements | Branches | Functions | Lines
# api.js    | 85.2%      | 75.0%    | 90.0%    | 85.2%
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Java
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      
      - name: Run backend tests
        run: cd backend && mvn test
      
      - name: Set up Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Run frontend tests
        run: cd frontend/student-tracker && npm install && npm test
```

---

## Next Steps

1. Run baseline tests: `mvn test` (backend) and `npm test` (frontend)
2. Check coverage reports
3. Address any failing tests
4. Add more test cases for edge cases
5. Integrate into CI/CD pipeline

