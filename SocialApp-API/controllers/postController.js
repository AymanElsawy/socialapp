const Joi = require("joi");
const Http = require("http-status-codes");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
module.exports = {
  addPost(req, res) {
    const schema = Joi.object({
      post: Joi.string().required(),
    }); // validation schema
    const { err } = schema.validate(req.body); // validation result
    if (err) {
      return res
        .status(Http.StatusCodes.NOT_FOUND)
        .json({ message: err.message });
    }
    const newPost = {
      post: req.body.post, //req.body.post is the post from the client
      user: req.user._id, // user is the id of the user who is logged in
      username: req.user.username, // this is the user who is logged in
      createdAt: new Date(), // new Date() is the current date and time
    };
    PostModel.create(newPost)
      .then(async (post) => {
        await UserModel.findByIdAndUpdate(req.user._id, {
          $push: {
            posts: {
              postId: post._id,
              post: post.post || req.body.post,
              createdAt: post.createdAt,
            }, // push the post to the user's posts array
          },
        }); // push the post id to the user's posts array
        return res
          .status(Http.StatusCodes.CREATED)
          .json({ message: "post created", post }); // 201 and the post created
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message }); // 500
      });
  },

  getAllPosts(req, res) {
    try {
      PostModel.find()
        .sort({ createdAt: -1 }) // sort the posts in descending order by createdAt
        .populate("user") // populate the user field with the user's data
        .then((posts) => {
          return res
            .status(Http.StatusCodes.OK)
            .json({ message: "All Posts", posts }); // 200 and the posts
        });
    } catch (err) {
      return res
        .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message }); // 500
    }
  }, //end of  getAllPosts

  addLike(req, res) {
    const id = req.body._id; // the id of the post that is being liked
    PostModel.updateOne(
      {
        _id: id,
        "likes.username": {
          $ne: req.user.username, // if the user has not liked the post yet
        },
      },
      {
        $push: {
          likes: {
            username: req.user.username, // the username of the user who liked the post
          },
        },
        $inc: {
          totalLikes: 1, // increment the total likes by 1
        },
      }
    )
      .then((result) => {
        return res.status(Http.StatusCodes.OK).json({ message: "Post liked" }); // 200 and the post liked
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message }); // 500
      });  
  }, // end of addLike
};
