@echo off
title TruthLens AI Launcher
echo =======================================================
echo           TRUTHLENS AI - LOCAL SERVER LAUNCHER
echo =======================================================
echo.
echo Make sure MongoDB is running on your system!
echo.
echo [1/2] Launching Python FastAPI AI Microservice...
start "TruthLens AI Service" cmd /c "cd ai-service && venv\Scripts\activate && python scripts/run_service.py"

echo [2/2] Launching Express Node Backend...
start "TruthLens Backend" cmd /c "cd backend && npm start"

echo.
echo =======================================================
echo Both services have been launched in separate windows!
echo.
echo Once the backend prints "listening", open:
echo.
echo       👉  http://localhost:5000  👈
echo.
echo =======================================================
echo.
pause
