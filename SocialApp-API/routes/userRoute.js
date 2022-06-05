const express = require("express");
const userController = require("../controllers/userController");
const authHelper = require("../helpers/authHelper");

const router = express.Router();

router.get("/all-users" ,authHelper.verfyToken ,userController.getAllUsers );    // get all users
router.get("/user/:id" ,authHelper.verfyToken ,userController.getUser);    // get user
module.exports = router;
