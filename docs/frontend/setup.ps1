# Frontend Setup Script
# Run this to fix all frontend errors

Write-Host "🚀 Starting Frontend Setup..." -ForegroundColor Green

# Navigate to frontend
Set-Location -Path "frontend"

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n🔧 Installing TypeScript types..." -ForegroundColor Yellow
npm install --save-dev @types/react @types/react-dom @types/node

Write-Host "`n🗄️ Setting up Prisma..." -ForegroundColor Yellow

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️ Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️ IMPORTANT: Edit .env and add your NeonDB DATABASE_URL!" -ForegroundColor Red
    Write-Host "Get it from: https://console.neon.tech" -ForegroundColor Cyan
    pause
}

Write-Host "`n🔨 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "`n💾 Pushing schema to database..." -ForegroundColor Yellow
npx prisma db push

Write-Host "`n🌱 Seeding database with mock data..." -ForegroundColor Yellow
npm run prisma:seed

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`n🎉 Run 'npm run dev' to start the development server" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan

Write-Host "`nTest credentials:" -ForegroundColor Yellow
Write-Host "  Admin: admin@homegoods.com / password123" -ForegroundColor White
Write-Host "  Customer: customer1@example.com / password123" -ForegroundColor White
