const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  balance: { type: Number, default: 500 },
}, {
  timestamps: true
});

// >>> DÜZELTİLEN KISIM <<<
// async function() kullanıyoruz, (next) parametresini kaldırdık!
userSchema.pre('save', async function () {
  // Şifre değişmediyse hiçbir şey yapma, çık.
  if (!this.isModified('password')) {
    return;
  }

  // Şifreyi zorla yazıya (String) çevirip hashle
  // Bu sayede "Illegal arguments: number" hatası da çözülür.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(String(this.password), salt);
});

// Şifre Doğrulama
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(String(enteredPassword), this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;  