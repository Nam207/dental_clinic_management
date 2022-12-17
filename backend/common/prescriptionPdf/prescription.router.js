const express = require('express');
const router = express.Router();
const needAuthenticated = require('../../middlewares/needAuthenticated');
const prescriptionPdf = require('./prescription.controller');
const multer = require('multer');

const memoryStorage = multer.memoryStorage()
const uploadWithMemoryStorage = multer({ storage: memoryStorage })

router.get(
    '/',
    //needAuthenticated,
    prescriptionPdf.exportPdf,
);

router.post(
    '/',
    uploadWithMemoryStorage.single('file'),
    prescriptionPdf.uploadToCloud
  );

module.exports = router;