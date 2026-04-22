@echo off
title Student Feedback App Launcher

echo Starting Backend (Spring Boot)...
start "Backend - Spring Boot" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo Waiting for backend to initialize...
timeout /t 20 /nobreak >nul

echo Starting Frontend (React + Vite)...
start "Frontend - React" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo =========================================
echo  Backend  : http://localhost:8080
echo  Frontend : http://localhost:5173
echo  Swagger  : http://localhost:8080/swagger-ui.html
echo =========================================
echo.
echo Both servers are starting in separate windows.
pause
