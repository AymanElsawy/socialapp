const Joi = require("joi");
const Http = require("http-status-codes");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const moment = require("moment");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "des1acmba",
  api_key: "496223554377871",
  api_secret: "1R2NKLhcDAdMxgj4qTEVGy2C73c",
});

module.exports = {
  addPost(req, res) {
    const schema = Joi.object({
      post: Joi.string().required(),
    }); // validation schema
    const postBody = {
      post: req.body.post, // the post
    };
    const { err } = schema.validate(postBody); // validation result
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

    if (req.body.post && !req.body.photo) {
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
    }
    if (req.body.post && req.body.photo) {
      cloudinary.uploader.upload(
        req.body.photo,
        {
          transformation: {
            width: 500, // width of the photo
            height: 400, // height of the photo
          },
        },
        async (err, result) => {
          const newPost = {
            post: req.body.post, //req.body.post is the post from the client
            photoVersion: result.version, // push photo version
            photoId: result.public_id, // push photo id
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
        }
      );
    }
  },

  getAllPosts(req, res) {
    try {
      const currentDate = moment().startOf("day"); // start of the day
      const endDate = moment(currentDate).subtract(1, "day"); // 2 days ago
      PostModel.find()
        .sort({ createdAt: -1 }) // sort the posts in descending order by createdAt
        .populate("user") // populate the user field with the user's data
        .then(async (posts) => {
          const topPosts = await PostModel.find({
            totalLikes: { $gte: 2 }, // find posts with at least 2 likes
            createdAt: { $gte: endDate.toDate() }, // find posts created 2 days ago
          })
            .populate("user")
            .sort({ createdAt: -1, totalLikes: -1 });
          return res
            .status(Http.StatusCodes.OK)
            .json({ message: "All Posts", posts, topPosts }); // 200 and the posts
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

  addComment(req, res) {
    const id = req.body.postId; // the id of the post that is being commented on
    const comment = req.body.comment; // the comment that is being added
    PostModel.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          comments: {
            comment: comment, // the comment that is being added
            username: req.user.username, // the username of the user who commented on the post
            userId: req.user._id, // the id of the user who commented on the post
          },
        },
      }
    )
      .then((result) => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "Comment added" }); // 200 and the comment added
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message }); // 500
      });
  }, // end of addComment

  getAllComments(req, res) {
    const id = req.params.id; // the id of the post that is being commented on
    PostModel.findById(id)
      .populate("comments.userId") // populate the userId field with the user's data
      .populate('user')
      .then((post) => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "All Comments", post }); // 200 and the comments
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message }); // 500
      });
  },
};
