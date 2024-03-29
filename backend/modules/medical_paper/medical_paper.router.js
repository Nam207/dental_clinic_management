const express = require("express");
const router = express.Router();
const medicalPaperController = require("./medical_paper.controller");
const needAuthenticated = require("../../middlewares/needAuthenticated");
const isRole = require("../../middlewares/isRole");
const {
  MedicalPaperSchema,
  UpdateMedicalPaperSchema,
} = require("./medical_paper.validation");
const validateInput = require("../../middlewares/validateInput");

router.get(
  "/getMedicalForDoctor",
  needAuthenticated,
  //isRole,
  medicalPaperController.getMedicalPaperForDoctor
);

router.get(
  "/",
  needAuthenticated,
  //isRole,
  medicalPaperController.getMedicalPaper
);

router.get(
  "/reExam",
  needAuthenticated,
  //isRole,
  medicalPaperController.getReExamination
);

router.post(
  "/",
  needAuthenticated,
  //isRole,
  validateInput(MedicalPaperSchema, "body"),
  medicalPaperController.createMedicalPaper
);

router.put(
  "/:medicalPaperId",
  needAuthenticated,
  //isRole,
  validateInput(UpdateMedicalPaperSchema, "body"),
  medicalPaperController.updateMedicalPaper
);

router.get(
  "/:medicalPaperId",
  needAuthenticated,
  //isRole,
  medicalPaperController.getMedicalPaperById
);

module.exports = router;
