# PowerShell script to start all local services.

$ErrorActionPreference = 'Stop'
$workspaceRoot = 'c:\Users\mssan\ai-student-grade-tracker\Ai-SGT'
$backendPath = Join-Path $workspaceRoot 'backend'
$frontendPath = Join-Path $workspaceRoot 'frontend\student-tracker'
$aiPath = Join-Path $workspaceRoot 'ai-engine'

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Student Tracker - Full Stack Application" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

Write-Host "[1/3] Starting AI engine on port 8000..." -ForegroundColor Yellow
Start-Process -FilePath 'cmd.exe' -ArgumentList '/k', "cd `"$aiPath`" && python -m uvicorn app:app --host 127.0.0.1 --port 8000" -WindowStyle Normal

Write-Host "[2/3] Starting Spring Boot backend on port 8080..." -ForegroundColor Yellow
Start-Process -FilePath 'cmd.exe' -ArgumentList '/k', "cd `"$backendPath`" && mvn spring-boot:run" -WindowStyle Normal

Write-Host "Waiting for backend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 15

Write-Host "[3/3] Starting React frontend on port 3000..." -ForegroundColor Yellow
Start-Process -FilePath 'cmd.exe' -ArgumentList '/k', "cd `"$frontendPath`" && npm.cmd start" -WindowStyle Normal

Write-Host "Waiting for frontend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 15

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "All services have been started." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend:    http://localhost:3000" -ForegroundColor Cyan
Write-Host "AI Engine:   http://localhost:8000/docs" -ForegroundColor Cyan

try { Start-Process 'http://localhost:3000' } catch {}
