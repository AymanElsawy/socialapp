const UserModel = require("../models/userModel");
const Http = require("http-status-codes");

module.exports = {
  getAllUsers(req, res) {
    UserModel.find({})
      .populate("posts.postId") // populate the posts with the postId
      .populate("followers.follower") // populate the followers with the follower
      .populate("following.userfollowed") // populate the following with the userfollowed
      .then((users) => {
        return res
          .status(Http.StatusCodes.OK) // 200
          .json({ message: "All users", users }); // get all users
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json(err.message); // 500
      });
  }, // getAllUsers
  getUser(req, res) {
    const id = req.params.id;
    UserModel.findOne({ _id: id })
      .populate("posts.postId") // populate the posts with the postId
      .populate("followers.follower") // populate the followers with the follower
      .populate("following.userfollowed") // populate the following with the userfollowed
      .then((user) => {
        return res
          .status(Http.StatusCodes.OK) // 200
          .json({ user }); // get user
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json(err.message); // 500
      });
  }, // getUser
};
