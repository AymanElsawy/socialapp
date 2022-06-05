const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.addUser); // register user
router.post("/login", authController.loginUser); // login user
module.exports = router;
