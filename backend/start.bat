@echo off
REM Start backend server script for Windows

echo Starting Backend Server...
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting FastAPI server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000
