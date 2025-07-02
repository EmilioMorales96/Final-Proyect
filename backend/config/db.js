import 'dotenv/config';
import { Sequelize } from 'sequelize';

console.log('DB config:', process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;
