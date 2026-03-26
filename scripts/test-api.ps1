# Polispectra API Test Script (PowerShell)
# Tests all endpoints with sample data

param(
    [string]$ApiUrl = "http://localhost:3001"
)

$ErrorActionPreference = "Stop"

$pass = 0
$fail = 0

Write-Host ""
Write-Host "🧪 Polispectra API Test Suite (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing API at: $ApiUrl"
Write-Host ""

# Test function
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Data,
        [int]$ExpectedStatus,
        [string]$Description
    )

    Write-Host -NoNewline "Testing $Description... "

    try {
        $params = @{
            Uri    = "$ApiUrl$Endpoint"
            Method = $Method
        }

        if ($Data) {
            $params.ContentType = "application/json"
            $params.Body = $Data
        }

        $response = Invoke-WebRequest @params -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value
    }

    if ($statusCode -eq $ExpectedStatus) {
        Write-Host "✓ $statusCode" -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host "✗ Got $statusCode, expected $ExpectedStatus" -ForegroundColor Red
        $script:fail++
    }
}

# Sample data
$philosophyData = @{
    title   = "Test Philosophy"
    answers = @(
        @{
            scaleA     = "self_mind"
            scaleB     = "self_tissue"
            preference = "A"
        },
        @{
            scaleA     = "self_tissue"
            scaleB     = "self_body"
            preference = "B"
        },
        @{
            scaleA     = "rel_parents"
            scaleB     = "oth_neighborhood"
            preference = "A"
        }
    )
} | ConvertTo-Json -Depth 10

$incompleteData = @{
    title = "incomplete"
} | ConvertTo-Json

$emptyData = @{
    title   = "hi"
    answers = @()
} | ConvertTo-Json

# POST Endpoint Tests
Write-Host "POST Endpoint Tests" -ForegroundColor Blue
Write-Host "---"
Test-Endpoint "POST" "/api/submit" $philosophyData 200 "Submit philosophy"
Test-Endpoint "POST" "/api/submit" $incompleteData 400 "Reject incomplete philosophy"
Test-Endpoint "POST" "/api/submit" $emptyData 400 "Reject empty answers"

# GET Endpoint Tests
Write-Host ""
Write-Host "GET Endpoint Tests" -ForegroundColor Blue
Write-Host "---"
Test-Endpoint "GET" "/api/philosophies" "" 200 "Fetch philosophies"
Test-Endpoint "GET" "/api/spectrum" "" 200 "Fetch spectrum data"

# Error Handling Tests
Write-Host ""
Write-Host "Error Handling Tests" -ForegroundColor Blue
Write-Host "---"
Test-Endpoint "DELETE" "/api/submit" "" 405 "Reject unsupported method"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $pass" -ForegroundColor Green
Write-Host "Failed: $fail" -ForegroundColor Red
Write-Host ""

if ($fail -eq 0) {
    Write-Host "✓ All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ Some tests failed" -ForegroundColor Red
    exit 1
}
