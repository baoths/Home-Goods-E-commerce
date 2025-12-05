#!/bin/bash

# Setup script for macOS/Linux

echo "========================================"
echo "Backend Setup - Home Goods E-commerce"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi

echo "[1/4] Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi
echo ""

echo "[2/4] Activating virtual environment..."
source venv/bin/activate
echo ""

echo "[3/4] Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo ""

echo "[4/4] Checking environment file..."
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Please edit .env file with your database credentials!"
else
    echo ".env file exists."
fi
echo ""

echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo ""
echo "To start the server:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run server: uvicorn main:app --reload"
echo ""
echo "API Documentation: http://localhost:8000/docs"
echo ""
