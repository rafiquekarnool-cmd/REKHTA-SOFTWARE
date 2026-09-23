@echo off
title REKHTA - Electron Setup Builder
cd /d "%~dp0"
echo ==========================================
echo   REKHTA Desktop - RK Solution
echo   Electron Windows Setup Builder
echo ==========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install Node.js first, then run this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing Electron build dependencies...
  call npm install
  if errorlevel 1 goto :fail
)
echo.
echo Building REKHTA Windows Setup with Electron...
call npm run dist
if errorlevel 1 goto :fail
echo.
echo SUCCESS: Setup created inside the dist folder.
explorer "%~dp0dist"
pause
exit /b 0
:fail
echo.
echo BUILD FAILED. Read the error shown above.
pause
exit /b 1
