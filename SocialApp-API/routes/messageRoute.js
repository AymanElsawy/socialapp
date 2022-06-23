const express = require("express");
const messageController = require("../controllers/messageController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post(
  "/chat/:senderId/:receiverId",
  authHelper.verfyToken,
  messageController.sendMessages
); // send message
router.get(
  "/chat/:senderId/:receiverId",
  authHelper.verfyToken,
  messageController.getAllMessages
); // get all messages
router.get(
  "/receiver-messages/:senderId/:receiverId",
  authHelper.verfyToken,
  messageController.markReceiverMessages
); // mark message as read
router.get(
  "/mark-all-messages",
  authHelper.verfyToken,
  messageController.markAllMessages
); // mark All message as read



module.exports = router;
