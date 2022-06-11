const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
    participants: [ 
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user sender id
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user reciver id
      }
  ], // participants of the conversation
  
});

module.exports = mongoose.model("Conversation", conversationSchema); // conversation model
