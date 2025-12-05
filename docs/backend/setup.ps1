# Backend Setup Script
# Run this to setup Python backend

Write-Host "🐍 Starting Backend Setup..." -ForegroundColor Green

# Navigate to backend
Set-Location -Path "backend"

Write-Host "`n🔧 Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

Write-Host "`n⚡ Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

Write-Host "`n📦 Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "`n⚠️ Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️ IMPORTANT: Edit .env and add your NeonDB DATABASE_URL!" -ForegroundColor Red
    Write-Host "Get it from: https://console.neon.tech" -ForegroundColor Cyan
    pause
}

Write-Host "`n✅ Backend Setup Complete!" -ForegroundColor Green
Write-Host "`n🎉 Run 'uvicorn main:app --reload' to start the server" -ForegroundColor Cyan
Write-Host "API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs at: http://localhost:8000/docs" -ForegroundColor Cyan

Write-Host "`n⚠️ Remember to activate venv first:" -ForegroundColor Yellow
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
