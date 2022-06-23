const Http = require("http-status-codes");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Helper = require('../helpers/helper');
const mongoose = require('mongoose');
module.exports = {
  sendMessages(req, res) {
    console.log(req.body);
    const { senderId, receiverId } = req.params; // get sender and receiver id from params
    Conversation.find(
      {
        // find conversation between sender and receiver
        $or: [
          {
            participants: {
              $elemMatch: {
                senderId: senderId, // if sender id is in participants
                receiverId: receiverId, // if receiver id is in participants
              },
            },
          },
          {
            participants: {
              $elemMatch: {
                senderId: receiverId, // if receiver id is in participants
                receiverId: senderId, // if sender id is in participants
              },
            },
          },
        ],
      },
      async (err, result) => {
        if (result.length > 0) {
          // if conversation found
          const msg = await Message.findOne({
            // find message with conversation id
            conversationId: result[0]._id,
          });
          Helper.updateChatList(req, msg); // update chat list
          await Message.updateOne(
            {
              conversationId: result[0]._id, // get conversation id
            },
            {
              $push: {
                // push message to conversation
                messages: {
                  senderId: req.user._id, // push user id
                  receiverId: req.params.receiverId, // push receiver id
                  senderName: req.user.username, // push user name
                  recevierName: req.body.receiverName, // push receiver name
                  body: req.body.message, // push message
                },
              },
            }
          )
            .then(
              () =>
                res
                  .status(Http.StatusCodes.OK)
                  .json({ message: "Message sent successfully" }) // send message successfully
            )
            .catch(
              (err) =>
                res
                  .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ message: "Error occured" }) // send error
            );
        } else {
          const newConversation = new Conversation(); // create new conversation
          newConversation.participants.push({
            // add participants to conversation
            senderId: req.user._id, // add sender id to participants
            receiverId: req.params.receiverId, // add receiver id to participants
          });
          const saveConversation = await newConversation.save(); // save conversation

          const newMessage = new Message(); // create new message
          newMessage.conversationId = saveConversation._id; // add conversation id to message
          newMessage.sender = req.user.username; // add sender to message
          newMessage.receiver = req.body.receiverName; // add receiver to message
          newMessage.messages.push({
            // add message to message
            senderId: req.user._id, // add sender id to message
            receiverId: req.body.receiverId, // add receiver id to message
            senderName: req.user.username, // add sender name to message
            recevierName: req.body.receiverName, // add receiver name to message
            body: req.body.message, // add message to message
          });

          await User.updateOne(
            {
              _id: req.user._id, // update sender user
            },
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      receiverId: req.params.receiverId, // add receiver id to chat list
                      messageId: newMessage._id, // add message id to chat list
                    },
                  ],
                  $position: 0, // add message id to chat list
                },
              },
            }
          );

          await User.updateOne(
            {
              _id: req.params.receiverId, // update reciver user
            },
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      receiverId: req.user._id, // add sender id to chat list
                      messageId: newMessage._id, // add message id to chat list
                    },
                  ],
                  $position: 0, // add message id to chat list
                },
              },
            }
          );
          await newMessage // save message
            .save()
            .then(() => {
              res
                .status(Http.StatusCodes.OK) // send response
                .json({ message: "Message sent" });
            })
            .catch((err) =>
              res
                .status(Http.StatusCodes.INTERNAL_SERVER_ERROR) // send response
                .json({ message: "Error occured" })
            );
        }
      }
    );
  },

  async getAllMessages(req, res) {
    const { senderId, receiverId } = req.params; // get sender and receiver id from params
    const conversation = await Conversation.find({
      // find conversation between sender and receiver
      $or: [
        {
          $and: [
            { "participants.senderId": senderId }, // if sender id is in participants
            { "participants.receiverId": receiverId }, // if receiver id is in participants
          ],
        },
        {
          $and: [
            { "participants.senderId": receiverId }, // if sender id is in participants
            { "participants.receiverId": senderId }, // if receiver id is in participants
          ],
        },
      ],
    }).select("_id"); // select conversation id
    if (conversation) {
      const message = await Message.findOne({
        conversationId: conversation[0]._id, // get conversation id
      });
      res
        .status(Http.StatusCodes.OK)
        .json({ message: "message returned", message }); // send response ok
    }
  },
  async markReceiverMessages(req, res) {
    const { senderId, receiverId } = req.params; // get sender and receiver id from params
    const msgs = await Message.aggregate([ // get all messages between sender and receiver
      { $unwind: "$messages" }, // unwind messages
      {
        $match: { // match messages
          $and: [
            {
              "messages.senderId": new mongoose.Types.ObjectId(senderId), // if sender id is in messages
            },
            {
              "messages.receiverId": new mongoose.Types.ObjectId(receiverId), // if receiver id is in messages
            },
          ], 
        }, 
      }, 
    ]); 
    if (msgs.length > 0) { // if messages found
      try { // try to update messages
        msgs.forEach(async (element) => { // for each message
          await Message.updateOne( // update message
            {
              "messages._id": element.messages._id, // get message id
            },
            { $set: { "messages.$.isRead": true } } //  $ first index match the query condition
          );
        });
        res
          .status(Http.StatusCodes.OK)
          .json({ message: "Messages marked as read" }); // send response ok
      } catch (err) {
        res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR) // send response err
          .json({ message: "Error occured" });
      }
    }
  },
  async markAllMessages(req, res) {
    const msgs = await Message.aggregate([ // get all messages
      { $unwind: "$messages" }, // unwind messages
      {
        $match: {
          "messages.receiverId": new mongoose.Types.ObjectId(req.user._id), // if receiver id is in messages equl current user id
        },
      },
    ]);
    if (msgs.length > 0) { // if messages found 
      try {
        msgs.forEach(async (element) => {   // for each message
          await Message.updateOne( // update message
            {
              "messages._id": element.messages._id, // get message id
            },
            { $set: { "messages.$.isRead": true } } //  $ first index match the query condition
          );
        });
        res
          .status(Http.StatusCodes.OK)
          .json({ message: "All Messages marked as read" }); // send response ok
      } catch (err) {
        res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR) // send response err
          .json({ message: "Error occured" });
      }
    }
  },
};
