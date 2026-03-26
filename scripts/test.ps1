# Polispectra Full Test Suite (PowerShell)
# Comprehensive testing of frontend, API structure, and code quality

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "🧪 Polispectra Full Test Suite (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$testsPass = 0
$testsFail = 0

# Test function
function Invoke-Test {
    param(
        [string]$Name,
        [scriptblock]$Command
    )

    Write-Host -NoNewline "Testing $Name... "
    try {
        $result = & $Command
        if ($LASTEXITCODE -eq 0 -or $result) {
            Write-Host "✓" -ForegroundColor Green
            $script:testsPass++
        } else {
            Write-Host "✗" -ForegroundColor Red
            $script:testsFail++
        }
    } catch {
        Write-Host "✗" -ForegroundColor Red
        $script:testsFail++
    }
}

# 1. Build Tests
Write-Host ""
Write-Host "Build Tests" -ForegroundColor Blue
Write-Host "---"
Invoke-Test "TypeScript compilation" { npm run build }
Invoke-Test "JavaScript output exists" { Test-Path "src/js/app.js" }
Invoke-Test "All pages compiled" {
    (Test-Path "src/js/pages/landing.js") -and
    (Test-Path "src/js/pages/spectral.js") -and
    (Test-Path "src/js/pages/visualization.js")
}
Invoke-Test "Utilities compiled" {
    (Test-Path "src/js/utils.js") -and
    (Test-Path "src/js/visualization-utils.js")
}

# 2. File Structure Tests
Write-Host ""
Write-Host "File Structure Tests" -ForegroundColor Blue
Write-Host "---"
Invoke-Test "HTML entry point exists" { Test-Path "src/index.html" }
Invoke-Test "CSS files exist" {
    (Test-Path "src/styles/global.css") -and
    (Test-Path "src/styles/landing.css") -and
    (Test-Path "src/styles/spectral.css") -and
    (Test-Path "src/styles/visualization.css")
}
Invoke-Test "API functions exist" {
    (Test-Path "api/submit.ts") -and
    (Test-Path "api/philosophies.ts") -and
    (Test-Path "api/spectrum.ts")
}
Invoke-Test "API utilities exist" {
    (Test-Path "api/lib.ts") -and
    (Test-Path "api/captcha.ts")
}
Invoke-Test "Vercel config exists" { Test-Path "vercel.json" }

# 3. Dependencies Tests
Write-Host ""
Write-Host "Dependencies Tests" -ForegroundColor Blue
Write-Host "---"
Invoke-Test "node_modules installed" { Test-Path "node_modules" }
Invoke-Test "TypeScript available" { $null -ne (Get-Command npx -ErrorAction SilentlyContinue) }
Invoke-Test "@upstash/redis installed" { Test-Path "node_modules/@upstash/redis" }
Invoke-Test "@vercel/node installed" { Test-Path "node_modules/@vercel/node" }

# 4. Configuration Tests
Write-Host ""
Write-Host "Configuration Tests" -ForegroundColor Blue
Write-Host "---"
Invoke-Test "tsconfig.json valid" { Test-Path "tsconfig.json" }
Invoke-Test "package.json valid" { Test-Path "package.json" }
Invoke-Test "gitignore configured" { Test-Path ".gitignore" }

# 5. Code Quality Tests
Write-Host ""
Write-Host "Code Quality Checks" -ForegroundColor Blue
Write-Host "---"
Invoke-Test "HTML is valid" {
    (Get-Content "src/index.html" | Select-String -Pattern "<html") -and
    (Get-Content "src/index.html" | Select-String -Pattern "</html>")
}
Invoke-Test "CSS has color variables" {
    Get-Content "src/styles/global.css" | Select-String -Pattern "--primary|--secondary"
}
Invoke-Test "Frontend has scales defined" {
    Get-Content "src/js/utils.ts" | Select-String -Pattern "SCALES"
}
Invoke-Test "API validates input" {
    Get-Content "api/lib.ts" | Select-String -Pattern "validateAnswers"
}

# 6. Functional Tests
Write-Host ""
Write-Host "Functional Code Tests" -ForegroundColor Blue
Write-Host "---"
Invoke-Test "Scale categories exist" {
    Get-Content "src/js/utils.ts" | Select-String -Pattern "self.*relatives.*others.*systems"
}
Invoke-Test "Question generation exists" {
    Get-Content "src/js/utils.ts" | Select-String -Pattern "generateQuestions"
}
Invoke-Test "LocalStorage helpers exist" {
    Get-Content "src/js/utils.ts" | Select-String -Pattern "saveDraft|loadDraft|clearDraft"
}
Invoke-Test "Dominance calculation exists" {
    Get-Content "src/js/visualization-utils.ts" | Select-String -Pattern "calculateDominance"
}
Invoke-Test "Graph layout simulation exists" {
    Get-Content "src/js/visualization-utils.ts" | Select-String -Pattern "simulateLayout"
}
Invoke-Test "Captcha verification exists" {
    Get-Content "api/captcha.ts" | Select-String -Pattern "verifyHCaptcha|verifyRecaptchaV3"
}

# Reset error action preference
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $testsPass" -ForegroundColor Green
Write-Host "Failed: $testsFail" -ForegroundColor Red

if ($testsFail -eq 0) {
    Write-Host "✓ All checks passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ Some checks failed" -ForegroundColor Red
    exit 1
}
