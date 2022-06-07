const express = require("express");
const friendController = require("../controllers/friendController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post(
  "/follow-user",
  authHelper.verfyToken,
  friendController.followingUser
); // follow user
router.post(
  "/unfollow-user",
  authHelper.verfyToken,
  friendController.unfollowingUser
); // follow user
router.post("/mark/:id", authHelper.verfyToken, friendController.markAsRead); // mark or delete notifications
router.post("/mark-all", authHelper.verfyToken, friendController.markAllAsRead); // mark All notifications as read
module.exports = router;
