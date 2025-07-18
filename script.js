//connect to db on mongodb atlas
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const utilities = require("./utilities/utilities");
const userRoute = require("./Routes/users_routes");
const activityRoute = require("./Routes/activities_routes");
const reportsRouter = require("./Routes/reports_routes");
const urimongodb = process.env.MONGO_URI; 
const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:5000",
      "http://192.168.1.217:8081",
      "https://cerulean-snickerdoodle-e5f9b7.netlify.app" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
/* 
app.options(cors()); */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(utilities.auth);
app.use("/users", userRoute);
app.use("/activities", activityRoute);
app.use("/reports", reportsRouter);


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
