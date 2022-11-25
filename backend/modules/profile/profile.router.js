const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const validateInput = require('../../middlewares/validateInput');
const { profileSchema }= require('./profile.validation');
const needAuthenticated = require('../../middlewares/needAuthenticated');


router.get(
  '/',
  //needAuthenticated,
  profileController.getProfile
);

router.get(
  '/checkPhone/:phone', 
  //needAuthenticated,
  profileController.checkPhone
)

router.get(
  '/checkEmail/:email', 
  //needAuthenticated,
  profileController.checkEmail
)

router.post(
  '/', 
  //needAuthenticated, 
  //isRole, 
  validateInput(profileSchema, 'body'),
  profileController.createProfile
);

router.put(
  '/:customerId', 
  //needAuthenticated, 
  //isRole, 
  validateInput(profileSchema, 'body'),
  profileController.updateProfile
);

router.get(
  '/:customerId', 
  //needAuthenticated, 
  //isRole, 
  profileController.getProfileById
);

router.put(
  '/:customerId/:status', 
  //needAuthenticated, 
  //isRole,
  profileController.updateStatus
);

module.exports = router;