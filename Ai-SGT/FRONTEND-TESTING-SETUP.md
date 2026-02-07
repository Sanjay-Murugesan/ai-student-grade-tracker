# Frontend Testing Setup Guide

## Installing Required Dependencies

If you haven't already installed the testing dependencies, run:

```bash
cd frontend/student-tracker

# Install Jest and React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react
npm install --save-dev identity-obj-proxy  # For CSS module mocking

# For coverage reports
npm install --save-dev jest-coverage-report
```

## Recommended package.json Scripts

Add these scripts to `frontend/student-tracker/package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "babel-jest": "^29.0.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/preset-react": "^7.18.0",
    "identity-obj-proxy": "^3.0.0"
  }
}
```

## Configuration Files Created

### 1. jest.config.js
Already created at `frontend/student-tracker/jest.config.js`

**Features:**
- JSDOM test environment for React
- CSS module mocking
- Code coverage collection
- Coverage thresholds

### 2. setupTests.js
Already updated at `frontend/student-tracker/src/setupTests.js`

**Features:**
- Jest DOM matchers
- localStorage mock
- Axios mock
- Console suppressors

## Running Tests

### Development Mode (Watch)
```bash
npm test
```
- Tests re-run on file changes
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

### CI/CD Mode (No Watch)
```bash
npm run test:ci
```
- Runs once and exits
- Suitable for GitHub Actions, Jenkins, etc.
- Generates coverage report

### Coverage Report
```bash
npm run test:coverage
```
- Generates detailed coverage report
- Creates `coverage/` folder with HTML report
- Open `coverage/lcov-report/index.html` to view

### Debug Mode
```bash
npm run test:debug
```
- Attach Chrome DevTools for debugging
- Open `chrome://inspect` to debug tests

## Test File Location Convention

All test files should follow the naming convention:
- `ComponentName.test.js` (same folder as component)
- `functionName.test.js` (same folder as function)

Example structure:
```
src/
├── pages/
│   ├── StudentLoginPage.js
│   ├── StudentLoginPage.test.js
│   ├── GradesPage.js
│   └── GradesPage.test.js
├── services/
│   ├── api.js
│   └── api.test.js
└── context/
    ├── AuthContext.js
    └── AuthContext.test.js
```

## Expected Test Output

When running tests, you should see:

```
PASS  src/pages/StudentLoginPage.test.js
  StudentLoginPage
    ✓ renders login form with username and password fields (45ms)
    ✓ updates input fields on user input (28ms)
    ✓ displays error message on failed login (156ms)
    ✓ has link to instructor login (12ms)
    ✓ has link to signup page (8ms)

PASS  src/services/api.test.js
  API Service Tests
    ✓ login should call POST /api/v1/auth/login (10ms)
    ✓ getUsers should call GET /api/v1/users (8ms)
    ✓ createUser should call POST /api/v1/users (9ms)

Test Suites: 4 passed, 4 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        3.456 s
```

## Troubleshooting

### "jest is not recognized"
```bash
# Run from frontend/student-tracker directory
cd frontend/student-tracker
npm test
```

### "Cannot find module"
```bash
# Install dependencies
npm install
```

### "CSS import errors"
Already configured in `jest.config.js` with moduleNameMapper.

### "Unexpected token" errors
Ensure babel configuration is present:
- Create `frontend/student-tracker/.babelrc`:
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### Tests timeout
```bash
# Increase timeout
npm test -- --testTimeout=10000
```

## CI/CD Integration Example

### GitHub Actions
```yaml
name: Frontend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd frontend/student-tracker && npm install
      - run: npm run test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Coverage Thresholds

Set in `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 70,      // 70% of branches covered
    functions: 70,     // 70% of functions covered
    lines: 70,         // 70% of lines covered
    statements: 70     // 70% of statements covered
  }
}
```

If coverage falls below these thresholds, tests will fail.

## Writing New Tests

### Basic Test Structure
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });
});
```

### Testing User Interactions
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('button click', () => {
  render(<Button onClick={mockFn}>Click me</Button>);
  fireEvent.click(screen.getByRole('button'));
  expect(mockFn).toHaveBeenCalled();
});
```

### Testing Async Operations
```javascript
import { render, screen, waitFor } from '@testing-library/react';

test('async data loading', async () => {
  api.getData.mockResolvedValue({ data: 'test' });
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

