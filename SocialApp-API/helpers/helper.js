const User = require('../models/userModel');
module.exports = {
  capitalize: (user) => {
    const name = user.toLowerCase(); // convert name to lower case
    return name.charAt(0).toUpperCase() + name.slice(1); // capitalize first letter
  }, // capitalize first letter
  updateChatList: async (req, message) => { // update chat list
    await User.updateOne( // update sender user
      {
        _id: req.user._id, // get user id
      },
      {
        $pull: { // pull chat list
          chatList: {
            receiverId: req.params.receiverId, 
          }, // pull receiver id
        },
      }
    );

    await User.updateOne( // update receiver user
      {
        _id: req.params.receiverId, // get receiver id
      },
      {
        $pull: {
          chatList: {
            receiverId: req.user._id,
          },
        },
      }
    );

    await User.updateOne( // update chat list for sender and receiver
      {
        _id: req.user._id, // get user id
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.params.receiverId, // push receiver id
                messageId: message._id, // push message id
              },
            ],
            $position: 0, // push message id at postion 0
          },
        },
      }
    );

    await User.updateOne(
      {
        _id: req.params.receiverId, // get receiver id
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.user._id, // push sender id
                messageId: message._id, // push message id
              }, 
            ],
            $position: 0, // push message id at postion 0
          },
        },
      }
    );
  },
};
