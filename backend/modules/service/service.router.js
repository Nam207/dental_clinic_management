const express = require("express");
const router = express.Router();
const serviceController = require("./service.controller");
const needAuthenticated = require("../../middlewares/needAuthenticated");
const isRole = require("../../middlewares/isRole");
const serviceSchema = require("./service.validation");
const validateInput = require("../../middlewares/validateInput");
const fileUploader = require("../../middlewares/cloudinary.config");

router.get(
  "/allService",
  needAuthenticated,
  // isRole,
  serviceController.getAllService
);

router.post(
  "/prescription",
  needAuthenticated,
  // isRole,
  serviceController.getMedicineByService
);

router.get(
  "/",
  needAuthenticated,
  // isRole,
  serviceController.getService
);

router.get(
  "/activeService",
  needAuthenticated,
  // isRole,
  serviceController.getActiveService
);

router.post(
  "/",
  needAuthenticated,
  // isRole,
  fileUploader.single("imageUrl"),
  validateInput(serviceSchema, "body"),
  serviceController.createService
);

router.put(
  "/:serviceId",
  needAuthenticated,
  // isRole,
  fileUploader.single("imageUrl"),
  validateInput(serviceSchema, "body"),
  serviceController.updateService
);

router.get(
  "/:serviceId",
  needAuthenticated,
  // isRole,
  serviceController.getServiceById
);

router.put(
  "/:serviceId/:status",
  needAuthenticated,
  // isRole,
  serviceController.updateStatus
);

module.exports = router;
