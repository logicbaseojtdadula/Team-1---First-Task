@echo off
echo ========================================
echo   STRUCTASK - Frontend Rebuild Script
echo ========================================
echo.

echo [1/3] Building React frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [2/3] Cleaning old files...
cd ..
rmdir /s /q backend\public\app 2>nul
rmdir /s /q backend\public\assets 2>nul
del /q backend\public\index.html 2>nul
echo.

echo [3/3] Copying new files to Laravel...
xcopy /E /I /Y frontend\dist\* backend\public\
echo.

echo ========================================
echo   SUCCESS! Frontend rebuilt.
echo   Refresh your browser to see changes.
echo ========================================
echo.
pause
