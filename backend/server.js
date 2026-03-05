const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Ortam değişkenlerini yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- ROTALAR ---

// 1. Kullanıcı İşlemleri (Login, Register, Profil)
// DİKKAT: Dosya adının 'backend/routes/userRoutes.js' olduğundan emin ol!
app.use('/api/users', require('./routes/userRoutes'));

// 2. İçerik İşlemleri (Film/Tiyatro Ekleme, Listeleme, Koltuklar)
// DİKKAT: Dosya adının 'backend/routes/contentRoutes.js' olduğundan emin ol!
app.use('/api/content', require('./routes/contentRoutes'));


// --- HATA YÖNETİMİ ---

// 404 - Sayfa Bulunamadı
app.use((req, res, next) => {
  const error = new Error(`Bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Genel Hata Yakalayıcı (500)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Sadece geliştirme modundaysak hatanın detayını göster
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));