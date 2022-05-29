const mongoose = require("mongoose");

const userScheam = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  posts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      post: { type: String },
      createdAt: { type: Date ,default: Date.now()},
    }
  ], // array of posts
});

module.exports = mongoose.model("User", userScheam);
