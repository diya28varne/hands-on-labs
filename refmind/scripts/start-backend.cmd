@echo off
REM RefMind backend
cd /d "%~dp0..\backend"
call venv\Scripts\uvicorn app.main:app --reload --port 8001
