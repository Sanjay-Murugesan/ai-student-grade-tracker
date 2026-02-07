@echo off
REM Script to start all services (MySQL, Backend, Frontend)

echo.
echo ==========================================
echo  Student Tracker - Full Stack Application
echo ==========================================
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL Server...
$env:PATH += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -proot -e "SELECT 'MySQL is running' as status;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MySQL is running and database exists
) else (
    echo ✗ MySQL is not running. Please start MySQL Server
    pause
    exit /b 1
)

echo.
echo [2/4] Starting Spring Boot Backend on port 8080...
echo.
start "Backend Server" cmd /k "cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\backend" && mvnw.cmd spring-boot:run"

REM Wait for backend to start
timeout /t 15 /nobreak

echo.
echo [3/4] Starting React Frontend on port 3001...
echo.
start "Frontend Server" cmd /k "cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\frontend\student-tracker" && npm start"

echo.
echo [4/4] Opening application in browser...
timeout /t 10 /nobreak

echo.
echo ==========================================
echo ✓ All services started successfully!
echo ==========================================
echo.
echo Backend API:  http://localhost:8080
echo Frontend:     http://localhost:3001
echo.
echo Press any key to continue...
pause

REM Open browser
start "" "http://localhost:3001"

echo.
echo To stop all services, close the command windows.
pause
