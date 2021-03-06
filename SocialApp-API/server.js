const mongoose = require("mongoose");
const config = require("./config/config");
const cookie = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");

const app = express();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const { User } = require("./helpers/userClass");
require("./socket/stream")(io, User, _);
require("./socket/privateChat")(io);

app.use(
  cors({
    methods: ["GET", "POST"],
  })
);
app.options("*", cors());

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookie());

mongoose.connect(
  config.databaseUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("database connected");
  }
);
const authRoute = require("./routes/authRoute"); // auth route
app.use("/api", authRoute);
const postRoute = require("./routes/postRoute"); //post route
app.use("/api", postRoute);
const userRoute = require("./routes/userRoute"); // user route
app.use("/api", userRoute);
const friendRoute = require("./routes/friendRoute"); // friend route
app.use("/api", friendRoute);
const messageRoute = require("./routes/messageRoute"); // message route
app.use("/api", messageRoute);
const photoRoute = require("./routes/photoRoute"); // message route
app.use("/api", photoRoute);

httpServer.listen(3000, () => {
  console.log("server connected");
});
