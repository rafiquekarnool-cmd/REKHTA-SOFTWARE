@echo off
title REKHTA Desktop
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing Electron...
  call npm install
  if errorlevel 1 (
    echo Installation failed.
    pause
    exit /b 1
  )
)
call npm start
