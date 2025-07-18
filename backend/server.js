// Entry point for backend server
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Backend server started\n📡 Port: ${PORT}\n🌍 Environment: ${process.env.NODE_ENV || 'development'}\n⏰ Started: ${new Date().toISOString()}\n`);
});
