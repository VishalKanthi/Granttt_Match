@echo off
echo Starting GrantMatch AI...

REM Start Backend
start "GrantMatch Backend" cmd /k "cd backend && call venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Start Frontend
start "GrantMatch Frontend" cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000/docs
pause
