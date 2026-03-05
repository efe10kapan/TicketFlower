const asyncHandler = require('express-async-handler');
const Content = require('../models/contentModel');
const Seat = require('../models/seatModel');

// @desc    Yeni İçerik (Film/Tiyatro) Ekle ve Koltukları Yarat
// @route   POST /api/content
// @access  Private/Admin
const addContent = asyncHandler(async (req, res) => {
  const { title, type, image, description, category, price, roomNumber } = req.body;

  if (!title || !price || !type) {
    res.status(400);
    throw new Error('Lütfen gerekli alanları doldurun');
  }

  // 1. Önce İçeriği Kaydet
  const content = await Content.create({
    title,
    type, // 'movie' veya 'theatre'
    image,
    description,
    category,
    price,
    roomNumber: roomNumber || 1, // Varsayılan Oda 1
  });

  if (content) {
    // 2. OTOMATİK KOLTUK OLUŞTURMA SİSTEMİ (Matrix)
    // Oda numarasına göre kapasite belirle
    let rows = 10; // Varsayılan satır
    let cols = 10; // Varsayılan sütun (100 Kişilik)

    if (content.roomNumber === 2) {
      rows = 10; cols = 12; // 120 Kişilik
    } else if (content.roomNumber === 3) {
      rows = 12; cols = 15; // 180 Kişilik
    }

    const seatsArray = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Matrix Döngüsü: A1, A2... B1, B2... diye koltuk üretir
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        seatsArray.push({
          contentId: content._id,
          row: alphabet[r], // A, B, C...
          number: c,        // 1, 2, 3...
          status: 'empty',  // Hepsi boş başlar
        });
      }
    }

    // Tek seferde yüzlerce koltuğu veritabanına gömüyoruz
    await Seat.insertMany(seatsArray);

    res.status(201).json({
      message: `İçerik ve ${seatsArray.length} adet koltuk başarıyla oluşturuldu!`,
      content,
    });
  } else {
    res.status(400);
    throw new Error('İçerik oluşturulamadı');
  }
});

// @desc    Tüm İçerikleri Getir (Tiyatro veya Film)
// @route   GET /api/content?type=movie
const getContent = asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  // Eğer ?type=movie gelirse sadece filmleri, gelmezse hepsini getir
  const filter = type ? { type } : {};
  
  const contents = await Content.find(filter).sort({ createdAt: -1 });
  res.json(contents);
});

// @desc    Tek Bir İçeriğin Detayını ve Koltuklarını Getir
// @route   GET /api/content/:id
const getContentById = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);
  
  if (content) {
    // İçeriğe ait koltukları da çekip gönderiyoruz
    const seats = await Seat.find({ contentId: content._id }).sort({ row: 1, number: 1 });
    res.json({ content, seats });
  } else {
    res.status(404);
    throw new Error('İçerik bulunamadı');
  }
});

// @desc    İçerik Sil (Koltuklarıyla Beraber)
const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (content) {
    await Seat.deleteMany({ contentId: content._id }); // Önce koltukları sil
    await content.deleteOne(); // Sonra filmi sil
    res.json({ message: 'İçerik ve koltuklar silindi' });
  } else {
    res.status(404);
    throw new Error('Bulunamadı');
  }
});

module.exports = { addContent, getContent, getContentById, deleteContent };