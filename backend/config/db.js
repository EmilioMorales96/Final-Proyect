import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Create Sequelize instance with database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    logging: false, // Disable SQL query logging in production
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for cloud database connections
      },
    },
  }
);

export default sequelize;
