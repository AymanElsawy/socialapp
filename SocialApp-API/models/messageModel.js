const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" }, // conversation id
  sender: { type: String }, // sender of the message
  receiver: { type: String }, // recevier of the message
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user sender id
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user reciver id
      senderName: { type: String }, // sender of the message
      recevierName: { type: String }, // recevier of the message
      body: { type: String, default: "" }, // body of the message
      isRead: { type: Boolean, default: false }, // is the message read
      createdAt: { type: Date, default: Date.now }, // date of the message
    },
  ],
});

module.exports = mongoose.model("Message", messageSchema); // message model
