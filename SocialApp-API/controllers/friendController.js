const UserModel = require("../models/userModel");
const Http = require("http-status-codes");
module.exports = {
  async followingUser(req, res) {
    const addUserToFollowingList = await UserModel.updateOne(
      // add user to following list
      {
        _id: req.user._id, // user id
        "following.userfollowed": { $ne: req.body.userfollowed }, // if user is not already following the user
      },
      {
        $push: {
          following: { userfollowed: req.body.userfollowed }, // add user to following list
        },
      }
    );
    const addUserToFollowersList = await UserModel.updateOne(
      // add user to followers list
      {
        _id: req.body.userfollowed, // user id
        "followers.follower": { $ne: req.user._id }, // if user is not already following the user
      },
      {
        $push: {
          followers: { follower: req.user._id }, // add user to followers list
          notifications: {
            senderId: req.user._id, // sender id
            action: `${req.user.username} is following you now`, // action
            createdAt: Date.now, // created at
          },
        },
      }
    );

    if (addUserToFollowingList && addUserToFollowersList) {
      // if both updates are successful
      return res.status(Http.StatusCodes.OK).json({ message: "User followed" }); // return success message 200
    }
  }, // follow user
  async unfollowingUser(req, res) {
    const removeUserFromFollowingList = await UserModel.updateOne(
      // remove user from following list
      {
        _id: req.user._id, // user id
      },
      {
        $pull: {
          following: { userfollowed: req.body.userfollowed }, // remove user from following list
        },
      }
    );
    const removeUserFromFollowersList = await UserModel.updateOne(
      // remove user from followers list
      {
        _id: req.body.userfollowed, // user id
      },
      {
        $pull: {
          followers: { follower: req.user._id }, // remove user from followers list
        },
      }
    );

    if (removeUserFromFollowersList && removeUserFromFollowingList) {
      // if both updates are successful
      return res
        .status(Http.StatusCodes.OK)
        .json({ message: "User unfollowed" }); // return success message 200
    }
  }, // unfollow user

  async markAsRead(req, res) {
    if (!req.body.deleteIt) {
      // if delete it is true
      await UserModel.updateOne(
        {
          _id: req.user._id, // user id
          "notifications._id": req.params.id, // notification id
        },
        {
          $set: {
            "notifications.$.read": true, // mark as read
          },
        }
      )
        .then((result) => {
          return res
            .status(Http.StatusCodes.OK)
            .json({ message: "Notification marked as read" }); // return success message 200
        })
        .catch((err) => {
          return res
            .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error marking notification as read" }); // return error message 500
        });
    } else {
      // if delete it is false
      await UserModel.updateOne(
        {
          _id: req.user._id, // user id
          "notifications._id": req.params.id, // notification id
        },
        {
          $pull: {
            notifications: { _id: req.params.id }, // remove notification
          },
        }
      )
        .then((result) => {
          return res
            .status(Http.StatusCodes.OK)
            .json({ message: "Notification deleted" }); // return success message 200
        })
        .catch((err) => {
          return res
            .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error deleteing notification" }); // return error message 500
        });
    }
  }, // mark as read

  async markAllAsRead(req, res) {
    await UserModel.updateOne(
      {
        _id: req.user._id, // user id
      },
      {
        $set: {
          "notifications.$[elem].read": true, // mark all as read
        },
      },
      {
        arrayFilters: [{ "elem.read": false }], // only mark as read if not already read
        multi: true, // multi update
      }
    )
      .then((result) => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "Notification marked All as read" }); // return success message 200
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error marking notification as read" }); // return error message 500
      });
  },
};
