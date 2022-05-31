const express = require("express");
const postController = require("../controllers/postController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.post("/post/add-post", authHelper.verfyToken, postController.addPost);
router.get("/post/get-all-posts", authHelper.verfyToken, postController.getAllPosts);

module.exports = router;
