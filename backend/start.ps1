# SafeHome Backend Start Script
Write-Host "Starting SafeHome Backend..." -ForegroundColor Green

# Start the server
node src/index.js

# If server crashes, restart after 5 seconds
if ($LASTEXITCODE -ne 0) {
    Write-Host "Server crashed, restarting in 5 seconds..." -ForegroundColor Red
    Start-Sleep -Seconds 5
    & $PSCommandPath
}