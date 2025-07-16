import dotenv from 'dotenv';
import app from './app-clean.js';
import db from './models/index.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Start the clean server
 */
const startServer = async () => {
  try {
    // Sync database with alter: true to update tables safely
    await db.sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully!");
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Clean server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
