const express = require('express');
const router = express.Router();
const serviceController = require('./service.controller');
const needAuthenticated = require('../../middlewares/needAuthenticated');
const isRole = require('../../middlewares/isRole');
const serviceSchema = require('./service.validation');
const validateInput = require('../../middlewares/validateInput')

router.get(
    '/', 
    needAuthenticated, 
    isRole, 
    serviceController.getService
);

router.post(
    '/', 
    needAuthenticated, 
    isRole, 
    validateInput(serviceSchema, 'body'),
    serviceController.createService
);

router.put(
    '/:serviceId', 
    needAuthenticated, 
    isRole, 
    validateInput(serviceSchema, 'body'),
    serviceController.updateService
);

router.get(
    '/:serviceId', 
    needAuthenticated, 
    isRole, 
    serviceController.getServiceById
);

router.put(
    '/:serviceId/:status', 
    needAuthenticated, 
    isRole,
    serviceController.updateStatus
);


module.exports = router;