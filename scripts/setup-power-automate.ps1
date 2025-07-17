# Power Automate Setup Script for FormsApp (PowerShell)
# This script helps configure the cloud storage integration

Write-Host "🚀 FormsApp Power Automate Integration Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "📋 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please edit it with your tokens." -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists." -ForegroundColor Green
}

# Create uploads directory if it doesn't exist
if (-not (Test-Path "uploads\tickets")) {
    Write-Host "📁 Creating uploads\tickets directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "uploads\tickets" -Force | Out-Null
    Write-Host "✅ Directory created: uploads\tickets" -ForegroundColor Green
} else {
    Write-Host "✅ Directory already exists: uploads\tickets" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔑 NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. OneDrive Setup:" -ForegroundColor White
Write-Host "   - Go to: https://portal.azure.com" -ForegroundColor Gray
Write-Host "   - Register a new app" -ForegroundColor Gray
Write-Host "   - Grant Files.ReadWrite permission" -ForegroundColor Gray
Write-Host "   - Get access token and add to .env:" -ForegroundColor Gray
Write-Host "     ONEDRIVE_ACCESS_TOKEN=your_token_here" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Dropbox Setup (Alternative):" -ForegroundColor White
Write-Host "   - Go to: https://www.dropbox.com/developers/apps" -ForegroundColor Gray
Write-Host "   - Create new app" -ForegroundColor Gray
Write-Host "   - Generate access token and add to .env:" -ForegroundColor Gray
Write-Host "     DROPBOX_ACCESS_TOKEN=your_token_here" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Power Automate Flow:" -ForegroundColor White
Write-Host "   - Create flow triggered by new files in OneDrive/Dropbox" -ForegroundColor Gray
Write-Host "   - Add actions to parse JSON and send emails" -ForegroundColor Gray
Write-Host "   - Add mobile notification action" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test the integration:" -ForegroundColor White
Write-Host "   - Start the server: npm start" -ForegroundColor Gray
Write-Host "   - Click help button in app" -ForegroundColor Gray
Write-Host "   - Create a support ticket" -ForegroundColor Gray
Write-Host "   - Check if file appears in cloud storage" -ForegroundColor Gray
Write-Host "   - Verify Power Automate flow triggers" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed instructions, see: docs\POWER_AUTOMATE_INTEGRATION.md" -ForegroundColor Cyan

# Optional: Open the documentation file
$docPath = "docs\POWER_AUTOMATE_INTEGRATION.md"
if (Test-Path $docPath) {
    $openDoc = Read-Host "Would you like to open the documentation? (y/n)"
    if ($openDoc -eq "y" -or $openDoc -eq "Y") {
        Start-Process $docPath
    }
}
