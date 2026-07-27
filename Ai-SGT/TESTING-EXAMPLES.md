# Testing Best Practices & Examples

## Table of Contents
1. [Backend Testing Patterns](#backend-testing-patterns)
2. [Frontend Testing Patterns](#frontend-testing-patterns)
3. [Common Testing Scenarios](#common-testing-scenarios)
4. [Mock Strategies](#mock-strategies)
5. [Assertions Guide](#assertions-guide)

---

## Backend Testing Patterns

### 1. Service Layer Testing

**Pattern: Mock all dependencies**

```java
@DisplayName("CourseService Tests")
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Course testCourse;

    @BeforeEach
    void setUp() {
        // Initialize mocks and test data
        MockitoAnnotations.openMocks(this);
        testCourse = createTestCourse();
    }

    @Test
    @DisplayName("Should create course with valid data")
    void testCreateCourse() {
        // Arrange: Set up mock behavior
        when(courseRepository.save(testCourse))
            .thenReturn(testCourse);

        // Act: Call service method
        Course result = courseService.createCourse(testCourse);

        // Assert: Verify result and interactions
        assertNotNull(result);
        assertEquals("Java 101", result.getCourseName());
        verify(courseRepository, times(1)).save(testCourse);
    }
}
```

**Key Points:**
- Use `@Mock` for dependencies
- Use `@InjectMocks` for class under test
- Call `MockitoAnnotations.openMocks(this)` in `@BeforeEach`
- Mock repository behavior with `when().thenReturn()`
- Verify method calls with `verify()`

---

### 2. Controller Layer Testing

**Pattern: Mock service layer, test HTTP responses**

```java
@DisplayName("GradeController Tests")
class GradeControllerTest {

    @Mock
    private GradeService gradeService;

    @InjectMocks
    private GradeController gradeController;

    @Test
    @DisplayName("POST /api/v1/grades should return 201 CREATED")
    void testCreateGradeReturns201() {
        // Arrange
        Grade newGrade = createTestGrade(85.0, "Good work!");
        when(gradeService.createGrade(newGrade))
            .thenReturn(newGrade);

        // Act
        ResponseEntity<Grade> response = gradeController.createGrade(newGrade);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(85.0, response.getBody().getScore());
        assertEquals("Good work!", response.getBody().getFeedback());
    }

    @Test
    @DisplayName("GET /api/v1/grades/:id should return 200 OK")
    void testGetGradeByIdReturns200() {
        Grade grade = createTestGrade(90.0, "Excellent!");
        when(gradeService.getGradeById(1L))
            .thenReturn(Optional.of(grade));

        ResponseEntity<Grade> response = gradeController.getGradeById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    @DisplayName("GET /api/v1/grades/:id should return 404 NOT FOUND")
    void testGetGradeByIdReturns404() {
        when(gradeService.getGradeById(999L))
            .thenReturn(Optional.empty());

        ResponseEntity<Grade> response = gradeController.getGradeById(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @DisplayName("DELETE /api/v1/grades/:id should return 204 NO CONTENT")
    void testDeleteGradeReturns204() {
        ResponseEntity<Void> response = gradeController.deleteGrade(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(gradeService, times(1)).deleteGrade(1L);
    }
}
```

**Key Points:**
- Test one HTTP endpoint per test method
- Verify HTTP status codes (200, 201, 204, 404)
- Check response body content
- Use descriptive test names with "Returns" + status code
- Test both success and error cases

---

## Frontend Testing Patterns

### 1. Page Component Testing

**Pattern: Render component, mock API, verify UI**

```javascript
describe('GradesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mocks before each test
  });

  test('should display grades table with data', async () => {
    // Arrange: Mock API response
    const mockGrades = [
      {
        gradeId: 1,
        assignmentId: 1,
        score: 85,
        feedback: 'Good work!',
      },
      {
        gradeId: 2,
        assignmentId: 2,
        score: 92,
        feedback: 'Excellent!',
      },
    ];

    api.getGrades.mockResolvedValue(mockGrades);

    // Act: Render component
    render(
      <Router>
        <AuthProvider>
          <GradesPage />
        </AuthProvider>
      </Router>
    );

    // Assert: Wait for data and verify rendering
    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('92')).toBeInTheDocument();
      expect(screen.getByText('Good work!')).toBeInTheDocument();
    });

    // Verify API was called
    expect(api.getGrades).toHaveBeenCalled();
  });

  test('should show empty state when no grades exist', async () => {
    api.getGrades.mockResolvedValue([]);

    render(
      <Router>
        <AuthProvider>
          <GradesPage />
        </AuthProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/no grades found/i)).toBeInTheDocument();
    });
  });

  test('should display error message on API failure', async () => {
    api.getGrades.mockRejectedValue(
      new Error('Failed to fetch grades')
    );

    render(
      <Router>
        <AuthProvider>
          <GradesPage />
        </AuthProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading grades/i)).toBeInTheDocument();
    });
  });
});
```

**Key Points:**
- Mock API responses with `api.getGrades.mockResolvedValue()`
- Use `render()` to render component
- Use `screen.getByText()` or `screen.getByRole()` to find elements
- Use `waitFor()` for async operations
- Test success, empty, and error scenarios
- Clear mocks in `beforeEach()`

---

### 2. Form Interaction Testing

**Pattern: Simulate user input, trigger handlers**

```javascript
describe('StudentLoginPage', () => {
  test('should update input fields on user input', () => {
    render(
      <Router>
        <AuthProvider>
          <StudentLoginPage />
        </AuthProvider>
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    // Simulate user typing
    fireEvent.change(usernameInput, { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(passwordInput, { 
      target: { value: 'password123' } 
    });

    // Verify input values updated
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('should call login API on form submission', async () => {
    api.login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 1, username: 'testuser' }
    });

    render(
      <Router>
        <AuthProvider>
          <StudentLoginPage />
        </AuthProvider>
      </Router>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify API was called
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        role: 'STUDENT'
      });
    });
  });

  test('should display error on failed login', async () => {
    api.login.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <Router>
        <AuthProvider>
          <StudentLoginPage />
        </AuthProvider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Error message appears
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

**Key Points:**
- Use `fireEvent.change()` to simulate user input
- Use `fireEvent.click()` to simulate button clicks
- Mock API calls and verify they're called with correct params
- Test both success and failure paths
- Use `waitFor()` for async state updates

---

## Common Testing Scenarios

### Scenario 1: Testing List Operations with Filtering

**Backend Example:**
```java
@Test
@DisplayName("Should get courses filtered by instructor")
void testGetCoursesByInstructor() {
    // Arrange: Create multiple courses
    Course course1 = new Course();
    course1.setCourseName("Java 101");
    course1.setInstructorId(1L);

    Course course2 = new Course();
    course2.setCourseName("Python 101");
    course2.setInstructorId(2L);

    List<Course> instructorCourses = Arrays.asList(course1);
    when(courseRepository.findByInstructorId(1L))
        .thenReturn(instructorCourses);

    // Act
    List<Course> result = courseService.getCoursesByInstructorId(1L);

    // Assert
    assertEquals(1, result.size());
    assertEquals(1L, result.get(0).getInstructorId());
    verify(courseRepository, times(1)).findByInstructorId(1L);
}
```

---

### Scenario 2: Testing Update with Partial Changes

**Backend Example:**
```java
@Test
@DisplayName("Should update only modified fields")
void testUpdateGradePartial() {
    Grade originalGrade = new Grade();
    originalGrade.setGradeId(1L);
    originalGrade.setScore(80.0);
    originalGrade.setFeedback("Needs improvement");

    Grade updatedGrade = new Grade();
    updatedGrade.setScore(85.0); // Only score changes
    // Feedback stays same

    when(gradeRepository.findById(1L))
        .thenReturn(Optional.of(originalGrade));
    when(gradeRepository.save(any(Grade.class)))
        .thenReturn(originalGrade);

    Grade result = gradeService.updateGrade(1L, updatedGrade);

    assertEquals(85.0, result.getScore()); // Updated
    assertEquals("Needs improvement", result.getFeedback()); // Unchanged
}
```

---

### Scenario 3: Testing Navigation/Routing

**Frontend Example:**
```javascript
test('should navigate to instructor login page', () => {
  render(
    <Router>
      <AuthProvider>
        <StudentLoginPage />
      </AuthProvider>
    </Router>
  );

  // Find link to instructor login
  const instructorLink = screen.getByText(/are you an instructor/i);
  expect(instructorLink).toBeInTheDocument();

  // Verify link destination
  expect(instructorLink).toHaveAttribute('href', '/instructor-login');
});
```

---

## Mock Strategies

### 1. Mock API Responses

```javascript
// Success response
api.getGrades.mockResolvedValue([
  { gradeId: 1, score: 85 },
  { gradeId: 2, score: 90 }
]);

// Error response
api.getGrades.mockRejectedValue(
  new Error('Network error')
);

// Pending (never resolves - for timeout testing)
api.getGrades.mockImplementation(
  () => new Promise(() => {})
);
```

### 2. Mock Repository Behavior

```java
// Mock save operation
when(gradeRepository.save(any(Grade.class)))
    .thenReturn(testGrade);

// Mock findById
when(gradeRepository.findById(1L))
    .thenReturn(Optional.of(testGrade));

// Mock exception
when(gradeRepository.save(any(Grade.class)))
    .thenThrow(new RuntimeException("Database error"));

// Mock multiple calls with different returns
when(courseRepository.findByInstructorId(1L))
    .thenReturn(Arrays.asList(course1))
    .thenReturn(Arrays.asList(course1, course2));
```

### 3. Mock Context/Providers

```javascript
// Mock AuthContext
const mockAuthValue = {
  isAuthenticated: true,
  user: { id: 1, username: 'testuser', role: 'STUDENT' },
  token: 'fake-token',
  login: jest.fn(),
  logout: jest.fn()
};

render(
  <Router>
    <AuthContext.Provider value={mockAuthValue}>
      <DashboardPage />
    </AuthContext.Provider>
  </Router>
);
```

---

## Assertions Guide

### Backend Assertions

```java
// Value assertions
assertEquals(expectedValue, actualValue);
assertNotEquals(unexpectedValue, actualValue);

// Boolean assertions
assertTrue(condition);
assertFalse(condition);

// Null assertions
assertNull(value);
assertNotNull(value);

// Collection assertions
assertEquals(expectedSize, list.size());
assertTrue(list.contains(element));
assertTrue(list.isEmpty());

// Exception assertions
assertThrows(Exception.class, () -> {
    serviceMethod();
});

// Mockito assertions
verify(mock, times(1)).methodCall();
verify(mock, never()).methodCall();
verify(mock, atLeastOnce()).methodCall();
```

### Frontend Assertions

```javascript
// Element presence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Text content
expect(screen.getByText('Hello')).toBeInTheDocument();
expect(element).toHaveTextContent('Hello');

// Form inputs
expect(input.value).toBe('testuser');
expect(checkbox).toBeChecked();

// CSS classes
expect(element).toHaveClass('active');

// Attributes
expect(link).toHaveAttribute('href', '/dashboard');

// Mock functions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(2);
```

---

## Test Organization Best Practices

✅ **Do:**
- One assertion per test (ideally)
- Descriptive test names
- Setup/teardown in beforeEach/afterEach
- Test one behavior per test method
- Isolate tests (no dependencies between tests)
- Use mocks for external dependencies

❌ **Don't:**
- Multiple assertions testing different behaviors
- Vague test names like "testFunction()"
- Setup in test method body
- Test multiple behaviors in one test
- Have tests depend on execution order
- Make HTTP calls in unit tests

---

## Coverage Goals

| Component | Target | Status |
|-----------|--------|--------|
| Services | > 85% | ✅ |
| Controllers | > 80% | ✅ |
| Frontend Pages | > 75% | ✅ |
| Frontend Services | > 80% | ✅ |

Run coverage reports to verify:
- **Backend**: `mvn clean test jacoco:report`
- **Frontend**: `npm test -- --coverage`

