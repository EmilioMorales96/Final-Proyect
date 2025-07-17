#!/bin/bash

# Power Automate Setup Script for FormsApp
# This script helps configure the cloud storage integration

echo "🚀 FormsApp Power Automate Integration Setup"
echo "============================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your tokens."
else
    echo "✅ .env file already exists."
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads/tickets" ]; then
    echo "📁 Creating uploads/tickets directory..."
    mkdir -p uploads/tickets
    echo "✅ Directory created: uploads/tickets"
else
    echo "✅ Directory already exists: uploads/tickets"
fi

echo ""
echo "🔑 NEXT STEPS:"
echo ""
echo "1. OneDrive Setup:"
echo "   - Go to: https://portal.azure.com"
echo "   - Register a new app"
echo "   - Grant Files.ReadWrite permission"
echo "   - Get access token and add to .env:"
echo "     ONEDRIVE_ACCESS_TOKEN=your_token_here"
echo ""
echo "2. Dropbox Setup (Alternative):"
echo "   - Go to: https://www.dropbox.com/developers/apps"
echo "   - Create new app"
echo "   - Generate access token and add to .env:"
echo "     DROPBOX_ACCESS_TOKEN=your_token_here"
echo ""
echo "3. Power Automate Flow:"
echo "   - Create flow triggered by new files in OneDrive/Dropbox"
echo "   - Add actions to parse JSON and send emails"
echo "   - Add mobile notification action"
echo ""
echo "4. Test the integration:"
echo "   - Start the server: npm start"
echo "   - Click help button in app"
echo "   - Create a support ticket"
echo "   - Check if file appears in cloud storage"
echo "   - Verify Power Automate flow triggers"
echo ""
echo "📖 For detailed instructions, see: docs/POWER_AUTOMATE_INTEGRATION.md"
