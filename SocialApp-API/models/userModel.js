const mongoose = require("mongoose");

const userScheam = mongoose.Schema({
  username: { type: String }, // username of the user
  email: { type: String }, // email of the user
  password: { type: String }, // password of the user
  following: [
    {
      userfollowed: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // following user id
    },
  ],
  followers: [
    {
      follower: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // follower user id
    },
  ],
  posts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // post id
      post: { type: String }, // post
      createdAt: { type: Date, default: Date.now() }, // created at
    },
  ], // array of posts
  notifications: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // sender id
      action: { type: String }, // action
      viewProfile: { type: Boolean, default: false }, // view profile
      createdAt: { type: Date, default: Date.now() }, // created at
      read: { type: Boolean, default: false }, // read
      date: { type: String, default: "" },
    },
  ],
  chatList: [
    {
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // receiver id
      messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, //message id
    },
  ],
  photoVersion: { type: String, default: "1656901224" }, // photo version
  photoId: { type: String, default: "pwp2wsmgi8etfwcnpa0l.jpg" }, // photo id
  photos: [
    {
      photoVersion: { type: String, default: "" }, // photo version
      photoId: { type: String, default: "" }, // photo id
    },
  ], // array of photos
});

module.exports = mongoose.model("User", userScheam); // UserModel
