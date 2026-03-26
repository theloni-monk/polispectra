# Polispectra Development Server (PowerShell)
# Runs both the TypeScript watcher and the local server

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "🚀 Starting Polispectra Development Environment (PowerShell)" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies not installed. Run setup-local.ps1 first." -ForegroundColor Yellow
    exit 1
}

# Function to cleanup on exit
$trap = {
    Write-Host ""
    Write-Host "Shutting down services..." -ForegroundColor Yellow
    # Kill background jobs
    Get-Job | Stop-Job
    Get-Job | Remove-Job
}

# Register trap for exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action $trap

# Start TypeScript watcher in background
Write-Host "Starting TypeScript watcher..." -ForegroundColor Blue
$devJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & pnpm run dev
} -Name "TypeScript-Watcher"

Start-Sleep -Seconds 1
Write-Host "✓ TypeScript watcher running (Job: $($devJob.Id))" -ForegroundColor Green

# Give TypeScript a moment to compile
Start-Sleep -Seconds 2

# Start the dev server
Write-Host "Starting local server on port 3000..." -ForegroundColor Blue
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & pnpm run serve
} -Name "Dev-Server"

Start-Sleep -Seconds 1
Write-Host "✓ Server running at http://localhost:3000" -ForegroundColor Green

Write-Host ""
Write-Host "Development environment ready!" -ForegroundColor Yellow
Write-Host "  - TypeScript files auto-compile on save" -ForegroundColor White
Write-Host "  - Refresh browser to see changes" -ForegroundColor White
Write-Host "  - Press Ctrl+C to stop" -ForegroundColor White
Write-Host ""

# Keep the script running and display job output
try {
    while ($true) {
        # Display any job output
        Get-Job | Receive-Job

        # Check if jobs are still running
        $devRunning = (Get-Job -Name "TypeScript-Watcher" -ErrorAction SilentlyContinue).State -eq "Running"
        $serverRunning = (Get-Job -Name "Dev-Server" -ErrorAction SilentlyContinue).State -eq "Running"

        if (-not $devRunning -or -not $serverRunning) {
            Write-Host "❌ One or more services have stopped" -ForegroundColor Red
            break
        }

        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host ""
    Write-Host "Shutting down services..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
}
