const clinicController = require("./clinic.controller");
const express = require("express");
const router = express.Router();
const needAuthenticated = require("../../middlewares/needAuthenticated");
const isRole = require("../../middlewares/isRole");
const clinicSchema = require("./clinic.validation");
const validateInput = require("../../middlewares/validateInput");
const fileUploader = require("../../middlewares/cloudinary.config");

router.get(
    "/",
    needAuthenticated,
    // isRole,
    clinicController.getClinic
);

router.put(
    "/",
    needAuthenticated,
    // isRole,
    fileUploader.single("icon"),
    validateInput(clinicSchema, "body"),
    clinicController.updateClinic
);
module.exports = router;

