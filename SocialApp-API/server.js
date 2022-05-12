const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const cookie = require("cookie-parser");

const cors = require("cors");
const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded());
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
const authRoute = require("./routes/authRoute");
app.use("/api", authRoute);

app.listen(3000, () => {
  console.log("server connected");
});
