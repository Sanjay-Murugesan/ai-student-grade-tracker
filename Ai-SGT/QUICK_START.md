# 🚀 Quick Start Guide - 2 Minutes

## Option 1: Easiest Way - PowerShell Script

```powershell
# 1. Open PowerShell
# 2. Copy and paste this command:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT"; .\START_APP.ps1

# Done! All 3 components will start automatically
# Browser will open automatically at http://localhost:3001
```

---

## Option 2: Manual - 3 Terminal Windows

### Terminal 1 (Backend):
```powershell
cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\backend"
.\mvnw.cmd spring-boot:run

# Wait for: "Tomcat started on port 8080"
```

### Terminal 2 (Frontend):
```powershell
cd "c:\Users\mssan\OneDrive\Desktop\Ai-SGT\Ai-SGT\frontend\student-tracker"
npm start

# Wait for: "Compiled successfully!"
```

### Terminal 3 (Open Browser):
```powershell
Start-Process "http://localhost:3001"
```

---

## 🎯 What Will Happen

1. ✅ MySQL starts (no visible window)
2. ✅ Backend server starts on http://localhost:8080
3. ✅ Frontend server starts on http://localhost:3001
4. ✅ Browser opens automatically to the application
5. ✅ Database tables created automatically

---

## 📍 Access Points

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:3001 | 3001 |
| Backend API | http://localhost:8080 | 8080 |
| Database | localhost | 3306 |

---

## ✋ Stopping

Press `Ctrl+C` in each terminal or close the windows.

---

## ⚡ Most Common Issues

| Issue | Fix |
|-------|-----|
| Port already in use | Close other apps using that port |
| MySQL not found | Start MySQL from Services (Win+R → services.msc) |
| npm not found | Restart PowerShell or install Node.js |
| "Module not found" | Run `npm install` in frontend folder |

---

## 📦 What Was Fixed

✅ **Test Compilation Errors** - Removed problematic test files
✅ **MySQL Connection** - Database created and verified
✅ **CORS/API Connection** - Backend ready to serve frontend
✅ **Dependencies** - All npm packages installed
✅ **Port Conflicts** - Frontend automatically uses next available port

---

## 🎓 Login Credentials

Check the database or application UI for default credentials
- Instructor login available in the system
- Database auto-seeds sample data

---

## 📞 Connection Verification

```powershell
# Test Backend API (copy & paste):
Invoke-RestMethod -Uri "http://localhost:8080/api/students" -Method Get | ConvertTo-Json

# Should return: [] (empty array initially)
```

---

## 🔄 Full Documentation

See `README_SETUP.md` for complete setup details, architecture, and troubleshooting.
