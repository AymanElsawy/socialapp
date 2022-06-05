const Jwt = require("jsonwebtoken");
const config = require("../config/config");
const Http = require("http-status-codes");
module.exports = {
  verfyToken(req, res, next) {
    if (!req.headers.authorization) { // if there is no token
      return res
        .status(Http.StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized request !!" }); // 401 and unauthorized request
    }
    const token =
      req.cookies.auth || req.headers["authorization"].split(" ")[1]; // token is the token from the client

    if (!token) { // if there is no token
      return res
        .status(Http.StatusCodes.UNAUTHORIZED)
        .json({ message: "you are not logged in" }); // 401 and unauthorized request 
    }
    Jwt.verify(token, config.secretForToken, (err, decoded) => {
      if (err) {
        if (err.expiredAt < Date.now()) {
          return res
            .status(Http.StatusCodes.UNAUTHORIZED)
            .json({ message: "token expired", token: null }); // 401 and unauthorized request 
        }
      }
      req.user = decoded.user;  // decoded.user is the user who is logged in 
      next(); // next() is the next middleware in the chain 
    });
  },
};
// End of file authHelper.js
