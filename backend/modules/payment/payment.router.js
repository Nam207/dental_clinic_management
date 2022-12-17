const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

router.get('/', paymentController.getPayment);

module.exports = router;