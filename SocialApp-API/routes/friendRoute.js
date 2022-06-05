const express = require("express");
const friendController = require("../controllers/friendController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post("/follow-user", authHelper.verfyToken, friendController.followingUser); // follow user
router.post("/unfollow-user", authHelper.verfyToken, friendController.unfollowingUser); // follow user
module.exports = router;
