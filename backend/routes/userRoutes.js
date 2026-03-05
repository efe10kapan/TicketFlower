const express = require('express');
const router = express.Router();
// Controller'dan fonksiyonları çekiyoruz
const { registerUser, loginUser, getMe } = require('../controllers/authController');
// Koruma middleware'i (Aşağıda oluşturacağız)
const { protect } = require('../middleware/authMiddleware');

// Kayıt Ol ve Giriş Yap
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profil Bilgisi (Korumalı Rota)
router.get('/me', protect, getMe);

module.exports = router;