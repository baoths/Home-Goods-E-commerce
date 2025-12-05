# Complete Project Setup Script
# Run this from the project root directory

Write-Host "🏠 Home Goods Store - Complete Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n📋 Prerequisites Check..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Install from: https://nodejs.org" -ForegroundColor Red
    exit
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Install from: https://python.org" -ForegroundColor Red
    exit
}

Write-Host "`n🎯 Step 1: Backend Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

Set-Location -Path "backend"

Write-Host "`n🔧 Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

Write-Host "⚡ Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if (-Not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️ Created backend/.env - You need to add DATABASE_URL!" -ForegroundColor Yellow
}

Set-Location -Path ".."

Write-Host "`n🎯 Step 2: Frontend Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

Set-Location -Path "frontend"

Write-Host "`n📦 Installing npm dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🔧 Installing TypeScript types..." -ForegroundColor Yellow
npm install --save-dev @types/react @types/react-dom @types/node

if (-Not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️ Created frontend/.env - You need to add DATABASE_URL!" -ForegroundColor Yellow
}

Write-Host "`n⚠️ IMPORTANT: Database Setup Required!" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host "`n1. Go to https://neon.tech and create a FREE account" -ForegroundColor Yellow
Write-Host "2. Create a new project" -ForegroundColor Yellow
Write-Host "3. Copy the connection string (starts with postgresql://...)" -ForegroundColor Yellow
Write-Host "4. Paste it into both:" -ForegroundColor Yellow
Write-Host "   - backend/.env (DATABASE_URL=...)" -ForegroundColor White
Write-Host "   - frontend/.env (DATABASE_URL=...)" -ForegroundColor White

Write-Host "`n👉 After adding DATABASE_URL, run:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npx prisma generate" -ForegroundColor White
Write-Host "   npx prisma db push" -ForegroundColor White
Write-Host "   npm run prisma:seed" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - GETTING_STARTED.md - Quick start guide" -ForegroundColor White
Write-Host "   - QUICK_START.md - 5-minute setup" -ForegroundColor White
Write-Host "   - frontend/TROUBLESHOOTING.md - Fix common errors" -ForegroundColor White

Set-Location -Path ".."

Write-Host "`n✅ Initial Setup Complete!" -ForegroundColor Green
Write-Host "Next steps in GETTING_STARTED.md" -ForegroundColor Cyan
