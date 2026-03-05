const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Header'da "Bearer" ile başlayan bir token var mı?
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı al (Bearer kelimesini at)
      token = req.headers.authorization.split(' ')[1];

      // Token'ı çöz
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı bul ve request'e ekle
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Yetkisiz erişim, token geçersiz');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Yetkisiz erişim, token yok');
  }
});

module.exports = { protect };