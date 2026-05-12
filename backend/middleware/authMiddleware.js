const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { findById } = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await findById(decoded.id);
      if (!user) {
        res.status(401);
        throw new Error('Yetkisiz erişim, kullanıcı bulunamadı');
      }
      req.user = user;
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