const express = require('express');
const router = express.Router();
const roleController = require('./role.controller');

router.get('/', roleController.getRole);

module.exports = router;