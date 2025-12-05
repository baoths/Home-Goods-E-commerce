@echo off
REM Setup script for Windows

echo ========================================
echo Backend Setup - Home Goods E-commerce
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Creating virtual environment...
if not exist venv (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)
echo.

echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo [3/4] Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt
echo.

echo [4/4] Checking environment file...
if not exist .env (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file with your database credentials!
) else (
    echo .env file exists.
)
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the server:
echo   1. Activate virtual environment: venv\Scripts\activate.bat
echo   2. Run server: uvicorn main:app --reload
echo.
echo API Documentation: http://localhost:8000/docs
echo.
pause
