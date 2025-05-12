//connect to db on mongodb atlas
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const utilities = require("./utilities/utilities");
const userRoute = require("./Routes/users_routes");
const activityRoute = require("./Routes/activities_routes");
const urimongodb = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:5000', "http://192.168.1.217:8081"], // ou um array: ['http://localhost:8081', 'http://192.168.1.217:8081']
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
/* 
app.options(cors()); */
app.use(express.json());
app.use(utilities.auth);
app.use("/users", userRoute);
app.use("/activities", activityRoute);

app.listen(
  port,
  /*  '0.0.0.0', */ () => {
    console.log("Server is running on port " + port);
    mongoose.connect(urimongodb);
  }
);

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);

mongoose.connection.once("open", function () {
  console.log("Base de dados conectada");
});
