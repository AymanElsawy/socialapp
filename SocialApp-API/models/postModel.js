const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user id
  username: { type: String, default: "" }, // username of the user who created the post
  post: { type: String, default: "" }, // the post
  photoVersion: { type: String, default: "" }, // the photo version
  photoId: { type: String, default: "" }, // the photo id
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String, default: "" }, // username of the user who commented on the post
      comment: { type: String, default: "" }, // the comment
      createdAt: { type: Date, default: Date.now() },
    },
  ], // comments on the post
  totalLikes: { type: Number, default: 0 },
  likes: [
    {
      username: { type: String, default: "" }, // username of the user who liked the post
    },
  ], // users who liked the post
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Post", postSchema);
