const express = require("express");
const router = express.Router();
const medicinePrescribeController = require("./medicine_prescribe.controller");
const needAuthenticated = require("../../middlewares/needAuthenticated");
const isRole = require("../../middlewares/isRole");
const MedicalPrescribeSchema = require("./medicine_prescribe.validation");
const validateInput = require("../../middlewares/validateInput");

router.get(
  "/",
  needAuthenticated,
  // isRole,
  medicinePrescribeController.getMedicineByMedicalPaper
);

router.post(
  "/",
  needAuthenticated,
  // isRole,
  validateInput(MedicalPrescribeSchema, "body"),
  medicinePrescribeController.inputMedicinePrescribe
);

module.exports = router;
