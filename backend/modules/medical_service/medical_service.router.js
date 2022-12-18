const express = require("express");
const router = express.Router();
const medicalServiceController = require("./medical_service.controller");
const needAuthenticated = require("../../middlewares/needAuthenticated");
const isRole = require("../../middlewares/isRole");
const validateInput = require("../../middlewares/validateInput");

router.get(
  "/",
  needAuthenticated,
  //isRole,
  medicalServiceController.getMedicalPaperWithService
);

router.get(
    "/updateStatus/:medicalServiceId/:status",
    needAuthenticated,
    //isRole,
    medicalServiceController.updateStatus
  );

module.exports = router;
