const mongoose = require("mongoose");

const userScheam = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("User", userScheam);
