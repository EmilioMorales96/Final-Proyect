#!/bin/bash

# SCRIPT PARA DEPLOYAR LA CORRECCIÓN FRONTEND-BACKEND
# ===================================================

echo "🚀 DEPLOYANDO CORRECCIÓN FRONTEND-BACKEND SEPARATION"
echo "======================================================"

echo "📝 Adding changes to git..."
git add .

echo "💾 Committing changes..."
git commit -m "Fix: Frontend-Backend separation for OAuth callbacks

- Created app-frontend-fix.js with proper route ordering
- API routes now have priority over static files
- OAuth callbacks will work without frontend interference
- Updated server.js to use the fixed configuration"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Wait for Render to deploy (2-3 minutes)"
echo "2. Test the OAuth URL generated above"
echo "3. Check that callbacks work correctly"
echo ""
echo "🔗 URLs to test after deployment:"
echo "- Health: https://backend-service-pu47.onrender.com/health"
echo "- Salesforce Test: https://backend-service-pu47.onrender.com/api/salesforce/test"
echo "- OAuth URL Generator: https://backend-service-pu47.onrender.com/api/salesforce/oauth-url-public"
