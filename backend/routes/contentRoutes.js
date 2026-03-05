const express = require('express');
const router = express.Router();
const { 
  addContent, 
  getContent, 
  getContentById, 
  deleteContent 
} = require('../controllers/contentController');

// İçerik Ekleme ve Listeleme
router.route('/')
  .post(addContent) // Admin buraya POST atacak
  .get(getContent); // Kullanıcı buradan GET yapacak

// Tekil İşlemler (Detay ve Silme)
router.route('/:id')
  .get(getContentById)
  .delete(deleteContent);

module.exports = router;