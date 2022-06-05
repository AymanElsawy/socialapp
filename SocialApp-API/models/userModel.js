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
      post: { type: String },   // post
      createdAt: { type: Date, default: Date.now() }, // created at
    },
  ], // array of posts
});

module.exports = mongoose.model("User", userScheam); // UserModel
