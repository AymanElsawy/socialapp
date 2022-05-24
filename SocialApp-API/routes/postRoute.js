const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("/post/add-post", postController.addPost);

module.exports = router;
