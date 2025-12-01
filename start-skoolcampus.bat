@echo off
REM SkoolCampus Startup Script for Windows
REM This script starts both backend and frontend servers

title SkoolCampus Launcher

echo.
echo ========================================
echo    Starting SkoolCampus
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    echo Please install npm
    pause
    exit /b 1
)

echo [INFO] Checking dependencies...
echo.

REM Check backend dependencies
if not exist "nestjs-backend\node_modules" (
    echo [INSTALL] Installing backend dependencies...
    cd nestjs-backend
    call npm install
    cd ..
)

REM Check frontend dependencies
if not exist "angular-frontend\node_modules" (
    echo [INSTALL] Installing frontend dependencies...
    cd angular-frontend
    call npm install
    cd ..
)

REM Check .env file
if not exist "nestjs-backend\.env" (
    echo [WARNING] No .env file found!
    echo [INFO] Creating .env from .env.example...
    copy nestjs-backend\.env.example nestjs-backend\.env
    echo.
    echo [WARNING] Please edit nestjs-backend\.env with your database credentials!
    echo Press any key after editing, or Ctrl+C to exit...
    pause >nul
)

REM Generate Prisma Client
if not exist "nestjs-backend\node_modules\.prisma" (
    echo [INFO] Generating Prisma Client...
    cd nestjs-backend
    call npm run prisma:generate
    cd ..
)

echo.
echo ========================================
echo [OK] Starting Backend (NestJS)...
echo ========================================
echo Backend: http://localhost:3000
echo API Docs: http://localhost:3000/api/docs
echo.

REM Start backend in new window
start "SkoolCampus Backend" cmd /k "cd nestjs-backend && npm run start:dev"

echo [INFO] Waiting for backend to initialize (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo [OK] Starting Frontend (Angular)...
echo ========================================
echo Frontend: http://localhost:4200
echo.

REM Start frontend in new window
start "SkoolCampus Frontend" cmd /k "cd angular-frontend && npm start"

echo.
echo ========================================
echo    SkoolCampus is Starting Up!
echo ========================================
echo.
echo Services:
echo   Backend:  http://localhost:3000/api
echo   Frontend: http://localhost:4200
echo   API Docs: http://localhost:3000/api/docs
echo.
echo Two new windows have opened:
echo   1. SkoolCampus Backend
echo   2. SkoolCampus Frontend
echo.
echo [INFO] Waiting for frontend to build (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo    SkoolCampus is Ready!
echo ========================================
echo.
echo Opening browser...
start http://localhost:4200

echo.
echo [OK] SkoolCampus is running!
echo.
echo To stop: Close the backend and frontend windows
echo           or run: stop-skoolcampus.bat
echo.
pause
