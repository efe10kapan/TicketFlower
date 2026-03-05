const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// REGISTER
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Basit doğrulama
    if (!name || !email || !password) {
        res.status(400); throw new Error('Lütfen tüm alanları doldurunuz.');
    }

    // Şifreyi zorla String (metin) formatına çeviriyoruz
    // 123456 (sayı) -> "123456" (yazı) olur. Bcrypt bunu sever.
    const safePassword = String(password); 

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
        res.status(400); throw new Error('Bu e-posta zaten kayıtlı.');
    }

    // Kullanıcı oluştur (Şifreleme işini Model yapacak)
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: safePassword, // Çevirdiğimiz güvenli şifreyi yolluyoruz
        isAdmin: false,
        balance: 500,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        res.status(400); throw new Error('Kullanıcı oluşturulamadı.');
    }
});

// LOGIN
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Login olurken de şifreyi string yapalım ki garanti olsun
    const safePassword = String(password);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(safePassword))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); throw new Error('E-posta veya şifre hatalı.');
    }
});

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

module.exports = { registerUser, loginUser, getMe };