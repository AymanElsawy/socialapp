const express = require("express");
const messageController = require("../controllers/messageController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post("/chat/:senderId/:receiverId", authHelper.verfyToken,messageController.sendMessage); // send message

module.exports = router;
