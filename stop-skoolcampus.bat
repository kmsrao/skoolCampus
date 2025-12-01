@echo off
REM SkoolCampus Stop Script for Windows
REM This script stops both backend and frontend servers

title Stop SkoolCampus

echo.
echo ========================================
echo    Stopping SkoolCampus
echo ========================================
echo.

echo [INFO] Stopping Backend (Port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [INFO] Stopping Frontend (Port 4200)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4200" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [INFO] Cleaning up Node.js processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq SkoolCampus*" >nul 2>&1

echo.
echo ========================================
echo [OK] SkoolCampus Stopped Successfully!
echo ========================================
echo.
pause
