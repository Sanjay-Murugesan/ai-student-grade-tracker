@echo off
REM Student Tracker - Test Suite Runner (Windows)

echo =========================================
echo Student Tracker - Test Suite Runner
echo =========================================
echo.

REM Backend Tests
echo [1/2] Running Backend Tests...
cd backend
call mvn clean test
set BACKEND_RESULT=%ERRORLEVEL%

if %BACKEND_RESULT% equ 0 (
    echo OK: Backend tests passed
) else (
    echo ERROR: Backend tests failed
)

cd ..

REM Frontend Tests
echo.
echo [2/2] Running Frontend Tests...
cd frontend/student-tracker
call npm test -- --coverage --watchAll=false
set FRONTEND_RESULT=%ERRORLEVEL%

if %FRONTEND_RESULT% equ 0 (
    echo OK: Frontend tests passed
) else (
    echo ERROR: Frontend tests failed
)

cd ../..

REM Summary
echo.
echo =========================================
echo Test Summary
echo =========================================

if %BACKEND_RESULT% equ 0 if %FRONTEND_RESULT% equ 0 (
    echo OK: All tests passed!
    exit /b 0
) else (
    echo ERROR: Some tests failed
    exit /b 1
)
