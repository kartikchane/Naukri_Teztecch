# Naukri Platform - Complete Installation Script
# Run this script to set up the entire project

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Naukri Platform - Installation Script      " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "Step 1: Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Step 2: Check MongoDB
Write-Host ""
Write-Host "Step 2: Checking MongoDB..." -ForegroundColor Yellow
Write-Host "Make sure MongoDB is installed and running" -ForegroundColor Cyan
Write-Host "Local MongoDB: mongod" -ForegroundColor Cyan
Write-Host "Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas" -ForegroundColor Cyan

# Step 3: Install Backend Dependencies
Write-Host ""
Write-Host "Step 3: Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Step 4: Install Frontend Dependencies
Write-Host ""
Write-Host "Step 4: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# Step 5: Check Environment File
Write-Host ""
Write-Host "Step 5: Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠ Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "Please update MongoDB URI and other settings in .env" -ForegroundColor Cyan
}

# Step 6: Create uploads directory
Write-Host ""
Write-Host "Step 6: Creating uploads directory..." -ForegroundColor Yellow
if (!(Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads" | Out-Null
    Write-Host "✓ Uploads directory created" -ForegroundColor Green
} else {
    Write-Host "✓ Uploads directory already exists" -ForegroundColor Green
}

# Installation Complete
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   ✓ Installation Complete!                    " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure MongoDB is running" -ForegroundColor White
Write-Host "2. (Optional) Seed database: npm run seed" -ForegroundColor White
Write-Host "3. Start backend: npm run dev" -ForegroundColor White
Write-Host "4. Start frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "   OR run both: npm run dev:all" -ForegroundColor White
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Test Credentials (after seeding):" -ForegroundColor Cyan
Write-Host "Job Seeker - jobseeker@example.com / password123" -ForegroundColor White
Write-Host "Employer   - employer@example.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "For detailed documentation, see:" -ForegroundColor Cyan
Write-Host "- README.md" -ForegroundColor White
Write-Host "- SETUP_GUIDE.md" -ForegroundColor White
Write-Host "- PROJECT_SUMMARY.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy Coding! 🚀" -ForegroundColor Green
