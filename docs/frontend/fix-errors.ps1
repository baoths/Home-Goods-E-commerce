# Fix Frontend Errors Script
# Run this if you're getting TypeScript/Module errors

Write-Host "🔧 Fixing Frontend Errors..." -ForegroundColor Yellow

Set-Location -Path "frontend"

Write-Host "`n1️⃣ Removing old dependencies..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "   ✅ Removed node_modules" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "   ✅ Removed package-lock.json" -ForegroundColor Green
}

if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✅ Removed .next cache" -ForegroundColor Green
}

Write-Host "`n2️⃣ Reinstalling dependencies..." -ForegroundColor Cyan
npm install

Write-Host "`n3️⃣ Installing TypeScript definitions..." -ForegroundColor Cyan
npm install --save-dev @types/react @types/react-dom @types/node

Write-Host "`n4️⃣ Regenerating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "`n5️⃣ Checking TypeScript compilation..." -ForegroundColor Cyan
npx tsc --noEmit

Write-Host "`n✅ Fix Complete!" -ForegroundColor Green
Write-Host "`n📝 If you still see errors in VS Code:" -ForegroundColor Yellow
Write-Host "   1. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "   2. Type: TypeScript: Restart TS Server" -ForegroundColor White
Write-Host "   3. Press Enter" -ForegroundColor White

Write-Host "`n🚀 Try running: npm run dev" -ForegroundColor Cyan

Set-Location -Path ".."
