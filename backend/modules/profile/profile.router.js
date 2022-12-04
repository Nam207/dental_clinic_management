const express = require("express");
const router = express.Router();

const profileController = require('./profile.controller');
const validateInput = require('../../middlewares/validateInput');
const profileSchema = require('./profile.validation');
const needAuthenticated = require('../../middlewares/needAuthenticated');

router.get("/", needAuthenticated, profileController.getProfile);


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
  needAuthenticated, 
  //isRole, 
  validateInput(profileSchema, 'body'),
  profileController.createProfile
);

router.put(
  '/:staffId', 
  //needAuthenticated, 
  //isRole, 
  validateInput(profileSchema, 'body'),
  profileController.updateProfile
);

router.get(
  '/:profileId', 
  //needAuthenticated, 
  //isRole, 
  profileController.getProfileById
);

router.put(
  '/:staffId/:status', 
  needAuthenticated, 
  //isRole,
  profileController.updateStatus
);

module.exports = router;

