const express = require('express');
const router = express.Router();
const functionController = require('./function.controller');

router.get('/', (e) => {console.log(1); next},functionController.getFunction);

module.exports = router;