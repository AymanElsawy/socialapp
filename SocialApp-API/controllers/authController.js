const Joi = require("joi");
const Http = require("http-status-codes");
const Bcryptjs = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Helper = require("../helpers/helper");
const Config = require("../config/config");
module.exports = {
  async addUser(req, res) {
    console.log(req.body);
    const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { err, value } = schema.validate(req.body);
    if (err) {
      return res
        .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }

    const userName = await User.findOne({
      username: Helper.capitalize(value.username),
    });
    if (userName) {
      return res
        .status(Http.StatusCodes.CONFLICT)
        .json({ message: "username is used before ! Go and login " });
    }
    const newEmail = await User.findOne({
      email: value.email.toLowerCase(),
    });
    if (newEmail) {
      return res
        .status(Http.StatusCodes.CONFLICT)
        .json({ message: "email is used before ! Go and login " });
    }
    return Bcryptjs.hash(value.password, 10, (err, hashed) => {
      if (err) {
        return res
          .status(Http.StatusCodes.BAD_REQUEST)
          .json({ message: "error while hashing password ", err: err.message });
      }
      const newUser = {
        username: Helper.capitalize(req.body.username),
        email: req.body.email.toLowerCase(),
        password: hashed,
      };
      User.create(newUser)
        .then((user) => {
          const token = Jwt.sign({ user: user }, Config.secretForToken, {
            expiresIn: "1d",
          });
          res.cookie('auth',token);
          return res.status(Http.StatusCodes.CREATED).json({
            message: "user created ",
            token: token,
          });
        })
        .catch((err) => {
          return res.status(Http.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "error while saving in db ",
            err: err.message,
          });
        });
    });
  },
};
