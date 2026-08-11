@echo off
cd /d "%~dp0"
echo.
echo  PRESTIJ - Agent 2 Web UI
echo  Opening http://localhost:5000
echo.
start http://localhost:5000
py app.py
pause
