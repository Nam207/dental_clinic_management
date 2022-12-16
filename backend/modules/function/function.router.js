const express = require('express');
const router = express.Router();
const functionController = require('./function.controller');

router.get('/',functionController.getFunction);


module.exports = router;