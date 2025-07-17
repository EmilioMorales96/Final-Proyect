import app from './app-debug.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3000;

console.log('🔧 Starting debug server...');

/**
 * Start the server and synchronize database
 * Uses alter: true to update existing tables without dropping data
 */
db.sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced successfully!");
  app.listen(PORT, () => {
    console.log(`🚀 Debug server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🛠️ Debug endpoint: http://localhost:${PORT}/debug/likes`);
  });
}).catch((error) => {
  console.error("❌ Failed to sync database:", error);
  console.error("⚠️ Starting server without database sync...");
  app.listen(PORT, () => {
    console.log(`🚀 Debug server running on port ${PORT} (no DB)`);
  });
});
