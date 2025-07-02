import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced!");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});