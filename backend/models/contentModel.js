const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['movie', 'theatre'], required: true }, // Film mi Tiyatro mu?
  image: { type: String, required: true }, // Afiş linki
  description: { type: String, required: true },
  category: { type: String }, // Komedi, Dram vb.
  duration: { type: Number }, // Dakika cinsinden süre
  director: { type: String }, // Yönetmen
  cast: [{ type: String }], // Oyuncular array'i
  educators: [{ type: String }], // Sadece tiyatro için eğitmenler
  price: { type: Number, required: true }, // Taban bilet fiyatı
  rating: { type: Number, default: 0 }, // Puan
  
  // Salon Bilgisi (Random oda ataması için)
  roomNumber: { type: Number, default: 1 }, // 1, 2 veya 3
  
  // İstatistikler için sayaçlar
  soldCount: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 }, // Ciro
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);