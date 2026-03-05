// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB bağlantısını .env dosyasındaki MONGO_URI ile kuruyoruz
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Bağlantı hatası durumunda uygulamayı kapat
  }
};

module.exports = connectDB;