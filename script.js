//connect to db on mongodb atlas
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
const utilities = require("./utilities/utilities");
const user_route = require("./routes/user_route.js");
const urimongodb = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(utilities.auth);
app.use("/users", user_route);
app.use(cors());

app.listen(port, () => {
  console.log("Server is running on port " + port);
  mongoose.connect(urimongodb);
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);

mongoose.connection.once("open", function () {
  console.log("Base de dados conectada");
});
