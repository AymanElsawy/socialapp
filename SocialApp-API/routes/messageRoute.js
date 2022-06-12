const express = require("express");
const messageController = require("../controllers/messageController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post("/chat/:senderId/:receiverId", authHelper.verfyToken,messageController.sendMessages); // send message
router.get("/chat/:senderId/:receiverId", authHelper.verfyToken,messageController.getAllMessages); 

module.exports = router;
