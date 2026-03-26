# Polispectra Local Test Environment Setup (PowerShell)
# This script sets up everything needed to run the app locally

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "🚀 Polispectra Local Test Environment Setup (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Blue

$hasNode = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
$hasPnpm = $null -ne (Get-Command pnpm -ErrorAction SilentlyContinue)

if (-not $hasNode) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

if (-not $hasPnpm) {
    Write-Host "❌ pnpm not found. Please install pnpm:" -ForegroundColor Red
    Write-Host "   npm install -g pnpm" -ForegroundColor White
    exit 1
}

$nodeVersion = & node --version
$pnpmVersion = & pnpm --version

Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
Write-Host "✓ pnpm $pnpmVersion" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies with pnpm..." -ForegroundColor Blue

try {
    & pnpm install
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm install failed: $_" -ForegroundColor Red
    exit 1
}

# Build TypeScript
Write-Host ""
Write-Host "Building TypeScript..." -ForegroundColor Blue

try {
    & pnpm run build
    Write-Host "✓ TypeScript compiled" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed: $_" -ForegroundColor Red
    exit 1
}

# Set up environment variables
Write-Host ""
Write-Host "Setting up environment variables..." -ForegroundColor Blue

if (-not (Test-Path .env.local)) {
    $envContent = @"
# Redis Configuration (set to your Upstash Redis instance)
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=your_token_here

# hCaptcha Configuration (optional for local testing)
HCAPTCHA_SECRET=your_hcaptcha_secret

# reCAPTCHA v3 Configuration (optional for local testing)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret

# Frontend API Base URL (for local development)
VITE_API_URL=http://localhost:3001
"@
    Set-Content -Path .env.local -Value $envContent
    Write-Host "✓ Created .env.local (configure Redis/captcha keys as needed)" -ForegroundColor Green
} else {
    Write-Host "✓ .env.local already exists" -ForegroundColor Green
}

# Display startup instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "✓ Setup Complete!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "To start the development server:" -ForegroundColor Blue
Write-Host "  .\scripts\dev.ps1" -ForegroundColor White
Write-Host ""
Write-Host "In another PowerShell terminal, to watch TypeScript changes:" -ForegroundColor Blue
Write-Host "  pnpm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The app will be available at:" -ForegroundColor Blue
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "For API testing (requires local Redis):" -ForegroundColor Blue
Write-Host "  1. Update .env.local with your Redis credentials" -ForegroundColor White
Write-Host "  2. Deploy to Vercel or use local serverless emulator" -ForegroundColor White
Write-Host ""
Write-Host "Frontend Features:" -ForegroundColor Yellow
Write-Host "  • Landing page with initial question" -ForegroundColor White
Write-Host "  • Spectral interface with slider comparisons" -ForegroundColor White
Write-Host "  • Visualization page with heatmap & rankings" -ForegroundColor White
Write-Host "  • LocalStorage draft persistence" -ForegroundColor White
Write-Host ""
Write-Host "Backend (Vercel Functions):" -ForegroundColor Yellow
Write-Host "  • POST /api/submit - Submit philosophy" -ForegroundColor White
Write-Host "  • GET /api/philosophies - Fetch recent submissions" -ForegroundColor White
Write-Host "  • GET /api/spectrum - Get spectrum statistics" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
