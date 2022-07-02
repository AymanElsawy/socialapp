const express = require("express");
const photoController = require("../controllers/photoController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post(
  "/upload-photo",
  authHelper.verfyToken,
  photoController.uploadPhoto
); // follow user

module.exports = router;
