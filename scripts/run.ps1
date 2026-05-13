# Unitree Shop - Development Start Script
# This script ensures dependencies are installed and then starts both API and Web in parallel.

Write-Host "🚀 Starting Unitree Shop Development Environment..." -ForegroundColor Cyan

# Check for pnpm
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: pnpm is not installed. Please install it with 'npm install -g pnpm'" -ForegroundColor Red
    exit 1
}

# Run dev command
pnpm dev
