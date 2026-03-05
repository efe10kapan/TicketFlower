// backend/models/sessionModel.js
const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  content_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  
  start_time: { type: Date, required: true }, // Seans başlangıç zamanı
  
  // Satılmış, ayrılmış ve rezerve koltuk ID'leri
  reserved_seats: { 
    type: [{ seatId: Number, status: { type: String, enum: ['sold', 'pending', 'reserved'] } }], 
    default: [] 
  },
  
  // İstatistiksel raporlama için
  total_sales: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;