const asyncHandler = require('express-async-handler');
const Content = require('../models/contentModel');
const Seat = require('../models/seatModel');

const addContent = asyncHandler(async (req, res) => {
  const { title, type, image, description, category, price, roomNumber } = req.body;
  if (!title || !price || !type) {
    res.status(400);
    throw new Error('Lütfen gerekli alanları doldurun');
  }

  const content = await Content.createContent({
    title,
    type,
    image,
    description,
    category,
    price,
    roomNumber: roomNumber || 1,
  });

  if (content) {
    let rows = 10;
    let cols = 10;
    if (content.roomNumber === 2) {
      rows = 10; cols = 12;
    } else if (content.roomNumber === 3) {
      rows = 12; cols = 15;
    }

    const seatsArray = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        seatsArray.push({
          contentId: content.id,
          row: alphabet[r],
          number: c,
          status: 'empty',
          pricePaid: 0,
        });
      }
    }

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

const getContent = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = {};

  if (type) {
    filter.type = type;
  }

  const contents = await Content.getAll(filter);
  res.json(contents);
});

const getContentById = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);
  if (content) {
    const seats = await Seat.findByContentId(content.id);
    res.json({ content, seats });
  } else {
    res.status(404);
    throw new Error('İçerik bulunamadı');
  }
});

const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);
  if (content) {
    await Seat.deleteByContentId(content.id);
    await Content.deleteById(content.id);
    res.json({ message: 'İçerik ve koltuklar silindi' });
  } else {
    res.status(404);
    throw new Error('Bulunamadı');
  }
});

module.exports = { addContent, getContent, getContentById, deleteContent };