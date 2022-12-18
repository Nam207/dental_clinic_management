const express = require("express");
const router = express.Router();
const billController = require("./bill.controller");
const needAuthenticated = require("../../middlewares/needAuthenticated");
const isRole = require("../../middlewares/isRole");
const BillSchema = require("./bill.validation");
const validateInput = require("../../middlewares/validateInput");

router.get(
  "/",
  needAuthenticated,
  // isRole,
  billController.getBillByMedicalPaper
);

router.post(
  "/",
  needAuthenticated,
  // isRole,
  validateInput(BillSchema, "body"),
  billController.inputBill
);

module.exports = router;
