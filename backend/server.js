import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3000;

/**
 * Start the server with graceful database handling
 * Try to sync database, but don't fail completely if there are issues
 */
async function startServer() {
  try {
    console.log("Attempting database sync...");
    await db.sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("⚠️ Database sync failed, but starting server anyway:");
    console.error(error.message);
    
    // Check if it's the enum error we're trying to fix
    if (error.message.includes('invalid input value for enum') && error.message.includes('General')) {
      console.log("🔧 This appears to be the topic enum issue.");
      console.log("💡 The server will start and migrations can be run to fix this.");
    }
  }
  
  // Start server regardless of database sync status
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🛠️ Debug endpoint: http://localhost:${PORT}/debug/likes`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log("🌐 Production server started successfully");
    }
  });
}

startServer();
