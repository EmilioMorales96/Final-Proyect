import dotenv from 'dotenv';
import app from './server-clean-v2.js'; // BACKEND COMPLETAMENTE LIMPIO V2.0
// No necesitamos DB para OAuth puro

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Inicio directo del servidor - sin complejidades de DB
app.listen(PORT, () => {
  console.log(`🚀 CLEAN OAUTH BACKEND v2.0 running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log(`� OAuth URL: http://localhost:${PORT}/oauth/url`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log("🌐 Production OAuth backend started successfully");
  }
});
