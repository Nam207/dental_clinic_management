const express = require('express');
const router = express.Router();
const needAuthenticated = require('../../middlewares/needAuthenticated');
const invoicePdf = require('./invoicePdf');
const multer = require('multer');

const memoryStorage = multer.memoryStorage()
const uploadWithMemoryStorage = multer({ storage: memoryStorage })

router.get(
  '/',
  needAuthenticated,
  invoicePdf.exportPdf,
);

router.post(
  '/',
  uploadWithMemoryStorage.single('file'),
  invoicePdf.uploadToCloud
);

module.exports = router;