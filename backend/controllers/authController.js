const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Lütfen tüm alanları doldurunuz.');
  }

  const safePassword = String(password);
  const userExists = await User.findByEmail(email.toLowerCase());
  if (userExists) {
    res.status(400);
    throw new Error('Bu e-posta zaten kayıtlı.');
  }

  const hashedPassword = await bcrypt.hash(safePassword, 10);
  const user = await User.createUser({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    isAdmin: false,
    balance: 500,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      balance: user.balance,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Kullanıcı oluşturulamadı.');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const safePassword = String(password);

  const user = await User.findByEmail(email.toLowerCase());
  if (user && (await bcrypt.compare(safePassword, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin || user.isAdmin,
      balance: user.balance,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('E-posta veya şifre hatalı.');
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, getMe };