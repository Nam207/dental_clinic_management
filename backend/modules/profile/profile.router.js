const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
const validateInput = require("../../middlewares/validateInput");
const { ProfileSchema, ProfileInforSchema } = require("./profile.validation");
const needAuthenticated = require("../../middlewares/needAuthenticated");

router.get("/getDoctorToday", needAuthenticated, profileController.getDoctorToday);

router.get("/getTechStaffToday", needAuthenticated, profileController.getTechStaffToday);

router.get("/curProfile", needAuthenticated, profileController.curProfile);

router.get("/allEmployee", needAuthenticated, profileController.getAllEmployee);

router.get("/", needAuthenticated, profileController.getProfile);

router.get("/getTechStaff", needAuthenticated, profileController.getTechStaff);

router.get(
  "/getReceptionist",
  needAuthenticated,
  profileController.getReceptionist
);

router.get(
  "/checkPhone/:phone",
  needAuthenticated,
  profileController.checkPhone
);

router.get(
  "/checkEmail/:email",
  needAuthenticated,
  profileController.checkEmail
);

router.post(
  "/",
  needAuthenticated,
  //isRole,
  validateInput(ProfileSchema, "body"),
  profileController.createProfile
);

router.put(
  "/editProfile/:staffId",
  needAuthenticated,
  //isRole,
  validateInput(ProfileInforSchema, "body"),
  profileController.editProfileByUser
);

router.put(
  "/:staffId",
  needAuthenticated,
  //isRole,
  validateInput(ProfileSchema, "body"),
  profileController.updateProfile
);

router.get("/getDoctor", needAuthenticated, profileController.getDoctor);

router.get(
  "/:profileId",
  needAuthenticated,
  //isRole,
  profileController.getProfileById
);

router.put(
  "/:staffId/:status",
  needAuthenticated,
  //isRole,
  profileController.updateStatus
);

module.exports = router;
