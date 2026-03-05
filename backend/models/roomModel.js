// backend/models/roomModel.js
const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  room_number: { type: Number, required: true, unique: true }, // Oda/Salon Numarası (1, 2, 3)
  capacity: { type: Number, required: true }, // Toplam koltuk kapasitesi
  // Koltuk düzeni için basit bir matris veya düzen tutulabilir. 
  // Basitlik için sadece kapasiteyi tutuyoruz ve koltuk ID'lerini (1'den kapasiteye kadar) kullanacağız.
  seating_layout: { type: String, default: 'Standard' }, 
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;