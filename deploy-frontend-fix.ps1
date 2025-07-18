# SCRIPT PARA DEPLOYAR LA CORRECCIÓN FRONTEND-BACKEND (Windows PowerShell)
# ========================================================================

Write-Host "🚀 DEPLOYANDO CORRECCIÓN FRONTEND-BACKEND SEPARATION" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

Write-Host "📝 Adding changes to git..." -ForegroundColor Yellow
git add .

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Fix: Frontend-Backend separation for OAuth callbacks

- Created app-frontend-fix.js with proper route ordering
- API routes now have priority over static files
- OAuth callbacks will work without frontend interference
- Updated server.js to use the fixed configuration"

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Wait for Render to deploy (2-3 minutes)" -ForegroundColor White
Write-Host "2. Test the OAuth URL generated above" -ForegroundColor White
Write-Host "3. Check that callbacks work correctly" -ForegroundColor White
Write-Host ""
Write-Host "🔗 URLs to test after deployment:" -ForegroundColor Cyan
Write-Host "- Health: https://backend-service-pu47.onrender.com/health" -ForegroundColor White
Write-Host "- Salesforce Test: https://backend-service-pu47.onrender.com/api/salesforce/test" -ForegroundColor White
Write-Host "- OAuth URL Generator: https://backend-service-pu47.onrender.com/api/salesforce/oauth-url-public" -ForegroundColor White
