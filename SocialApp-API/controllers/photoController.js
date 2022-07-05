const cloudinary = require("cloudinary").v2;
const User = require("../models/userModel");
const Http = require("http-status-codes");

cloudinary.config({
  cloud_name: "des1acmba",
  api_key: "496223554377871",
  api_secret: "1R2NKLhcDAdMxgj4qTEVGy2C73c",
});
module.exports = {
  uploadPhoto: (req, res) => {
    // upload photo
    cloudinary.uploader.upload(
      req.body.photo,
      {
        transformation: {
          width: 500, // width of the photo
          height: 500, // height of the photo
          crop: "fill", // crop the photo
          gravity: "face", // center the photo
        },
      },
      async (err, result) => {
        await User.updateOne(
          { _id: req.user._id },
          {
            $push: {
              // push photo to user
              photos: {
                // push photo to user
                photoVersion: result.version, // push photo version
                photoId: result.public_id, // push photo id
              },
            },
          }
        )
          .then(() => {
            return res
              .status(Http.StatusCodes.OK)
              .json({ message: "photo uploaded" }); // 200 and the posts
          })
          .catch((err) => {
            return res
              .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: "photo not uploaded" }); // 500
          });
      }
    );
  },

  setDefaultPhoto(req, res) {
    // set default photo
    const { photoVersion, photoId } = req.params;
    User.updateOne(
      { _id: req.user._id }, // update user by id
      {
        photoVersion: photoVersion, // set default photo version
        photoId: photoId, // set default photo id
      }
    )
      .then(() => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "photo set as default" }); // 200 and update the profile
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "photo not set as default" }); // 500
      });
  },

  deletePhoto(req, res) {
    // delete photo
    const { photoId } = req.params;
    cloudinary.uploader.destroy(photoId, async (err, result) => { // delete photo from cloudinary
      if (result.result === "ok") { // if photo deleted
        await User.updateOne( // update user
          { _id: req.user._id }, // update user by id
          {
            $pull: {
              // pull photo from user
              photos: {
                // pull photo from user
                photoId: photoId, // pull photo id
              },
            },
          }
        )
          .then(() => {
            return res
              .status(Http.StatusCodes.OK)
              .json({ message: "photo deleted" }); // 200 and update the profile
          })
          .catch((err) => {
            return res
              .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: "photo not deleted" }); // 500
          });
      }
      if (err) {
        return res // if error
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "photo not deleted" }); // 500
      }
    });
  },
};
