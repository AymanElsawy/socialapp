const express = require("express");
const postController = require("../controllers/postController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post("/post/add-post", authHelper.verfyToken, postController.addPost); // add post
router.get("/post/get-all-posts", authHelper.verfyToken, postController.getAllPosts); // get all posts
router.post("/post/like-post", authHelper.verfyToken, postController.addLike); // like post
router.post("/post/comment-post", authHelper.verfyToken, postController.addComment); // comment post
router.get("/post/:id", authHelper.verfyToken, postController.getAllComments); // get post


module.exports = router;
