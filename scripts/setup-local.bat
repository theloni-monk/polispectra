@echo off
REM Polispectra Local Test Environment Setup (Windows)
REM This batch script sets up everything needed to run the app locally on Windows

setlocal enabledelayedexpansion

echo.
echo 🚀 Polispectra Local Test Environment Setup (Windows)
echo ========================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✓ Node.js %NODE_VERSION%
echo ✓ npm %NPM_VERSION%

REM Install dependencies
echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Build TypeScript
echo.
echo Building TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✓ TypeScript compiled

REM Create .env.local if it doesn't exist
echo.
echo Setting up environment variables...
if not exist .env.local (
    (
        echo # Redis Configuration (set to your Upstash Redis instance^)
        echo REDIS_URL=redis://localhost:6379
        echo REDIS_TOKEN=your_token_here
        echo.
        echo # hCaptcha Configuration (optional for local testing^)
        echo HCAPTCHA_SECRET=your_hcaptcha_secret
        echo.
        echo # reCAPTCHA v3 Configuration (optional for local testing^)
        echo RECAPTCHA_SECRET_KEY=your_recaptcha_secret
        echo.
        echo # Frontend API Base URL (for local development^)
        echo VITE_API_URL=http://localhost:3001
    ) > .env.local
    echo ✓ Created .env.local (configure Redis/captcha keys as needed^)
) else (
    echo ✓ .env.local already exists
)

echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo To start the development server:
echo   npm run serve
echo.
echo In another terminal, to watch TypeScript changes:
echo   npm run dev
echo.
echo The app will be available at:
echo   http://localhost:3000
echo.
echo To run the test suite:
echo   npm test (if configured^)
echo.
echo ========================================

pause
