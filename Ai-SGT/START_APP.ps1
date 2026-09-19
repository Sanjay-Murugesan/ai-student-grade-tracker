# PowerShell Script to start all services

Write-Host "`n=========================================="
Write-Host "  Student Tracker - Full Stack Application" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Add MySQL to PATH
$env:PATH += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Check if MySQL is running
Write-Host "[1/4] Checking MySQL Server..." -ForegroundColor Yellow
try {
    mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS student_tracker_db; SELECT 'MySQL is running' as status;" 2>$null
    Write-Host "✓ MySQL is running and database exists" -ForegroundColor Green
} catch {
    Write-Host "✗ MySQL is not running. Please start MySQL Server" -ForegroundColor Red
    exit 1
}

# Start Backend
Write-Host "`n[2/4] Starting Spring Boot Backend on port 8080..." -ForegroundColor Yellow
$backendPath = "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\backend"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd `"$backendPath`" && mvnw.cmd spring-boot:run" -WindowStyle Normal

# Wait for backend to start
Write-Host "Waiting for backend to start (15 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Start Frontend
Write-Host "`n[3/4] Starting React Frontend on port 3001..." -ForegroundColor Yellow
$frontendPath = "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\frontend\student-tracker"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd `"$frontendPath`" && npm start" -WindowStyle Normal

# Wait for frontend to start
Write-Host "Waiting for frontend to start (10 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host "`n=========================================="
Write-Host "✓ All services started successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "`nBackend API:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend:     http://localhost:3001" -ForegroundColor Cyan
Write-Host "`nOpening application in browser...`n" -ForegroundColor Cyan

# Open browser
Start-Process "http://localhost:3001"

Write-Host "To stop all services, close the command windows." -ForegroundColor Yellow
Write-Host "Press any key to exit this script..."
$null = [Console]::ReadKey($true)
