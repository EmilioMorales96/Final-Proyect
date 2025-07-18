#!/usr/bin/env node

import dotenv from 'dotenv';
import app from './app.js';
import db from './models/index.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("Attempting database sync...");
    await db.sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("⚠️ Database sync failed, but starting server anyway:");
    console.error(error.message);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 Salesforce OAuth: http://localhost:${PORT}/api/salesforce/oauth-url-public`);
  });
}

startServer();
