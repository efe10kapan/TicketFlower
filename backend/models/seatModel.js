const mongoose = require('mongoose');

const seatSchema = mongoose.Schema({
  contentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Content', 
    required: true 
  }, // Hangi filme ait?
  
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, // Kim aldı? (Boşsa null)

  row: { type: String, required: true }, // A, B, C sırası
  number: { type: Number, required: true }, // 1, 2, 3...
  
  // Status: 'empty' (beyaz), 'reserved' (gri), 'sold' (kırmızı), 'selected' (yeşil-frontend)
  status: { 
    type: String, 
    enum: ['empty', 'reserved', 'sold'], 
    default: 'empty' 
  },

  // Bilet Tipi
  ticketType: {
    type: String,
    enum: ['full', 'student', 'veteran', 'none'], // Tam, Öğrenci, Gazi
    default: 'none'
  },
  
  pricePaid: { type: Number, default: 0 } // Kaça satıldı
}, {
  timestamps: true
});

module.exports = mongoose.model('Seat', seatSchema);