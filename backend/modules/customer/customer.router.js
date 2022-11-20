const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');
const needAuthenticated = require('../../middlewares/needAuthenticated');
const isRole = require('../../middlewares/isRole');
const customerSchema = require('./customer.validation');
const validateInput = require('../../middlewares/validateInput')

router.get(
    '/', 
    needAuthenticated, 
    //isRole, 
    customerController.getCustomer
);

router.get(
    '/checkPhone/:phone', 
    needAuthenticated,
    customerController.checkPhone
)

router.get(
    '/checkEmail/:email', 
    needAuthenticated,
    customerController.checkEmail
)

router.get(
    '/activeCustomer', 
    needAuthenticated, 
    //isRole, 
    customerController.getActiveCustomer
);

router.post(
    '/', 
    needAuthenticated, 
    //isRole, 
    validateInput(customerSchema, 'body'),
    customerController.createCustomer
);

router.put(
    '/:customerId', 
    needAuthenticated, 
    //isRole, 
    validateInput(customerSchema, 'body'),
    customerController.updateCustomer
);

router.get(
    '/:customerId', 
    needAuthenticated, 
    //isRole, 
    customerController.getCustomerById
);

router.put(
    '/:customerId/:status', 
    needAuthenticated, 
    //isRole,
    customerController.updateStatus
);


module.exports = router;