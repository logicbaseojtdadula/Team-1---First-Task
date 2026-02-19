@echo off
echo ========================================
echo Starting Full-Stack Task Manager
echo ========================================
echo.
echo Your IP Address: 192.168.254.114
echo.
echo Backend will run on: http://192.168.254.114:8000
echo Frontend will run on: http://192.168.254.114:5173
echo.
echo You can access from any device on your network!
echo ========================================
echo.

echo Starting Backend...
start "Backend Server" cmd /k "cd backend && php artisan serve --host=0.0.0.0 --port=8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo.
echo Access your app at:
echo http://192.168.254.114:5173
echo.
echo Or from this computer:
echo http://localhost:5173
echo ========================================
