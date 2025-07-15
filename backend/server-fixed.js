import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3000;

/**
 * Start the server and synchronize database
 * Uses alter: true to update existing tables without dropping data
 */
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully!");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to sync database:", error);
  process.exit(1);
});
