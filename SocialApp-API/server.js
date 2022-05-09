const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

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
