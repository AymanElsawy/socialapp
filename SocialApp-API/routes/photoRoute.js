const express = require("express");
const photoController = require("../controllers/photoController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post(
  "/upload-photo",
  authHelper.verfyToken,
  photoController.uploadPhoto
); // follow user
router.get(
  "/set-as-profile/:photoVersion/:photoId",
  authHelper.verfyToken,
  photoController.setDefaultPhoto
); // set photo as profile
router.get(
  "/delete-photo/:photoId",
  authHelper.verfyToken,
  photoController.deletePhoto
); // delete photo

module.exports = router;
