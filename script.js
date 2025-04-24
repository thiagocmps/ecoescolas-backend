//connect to db on mongodb atlas
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const utilities = require("./utilities/utilities");
const user_route = require("./Routes/user_route");
const urimongodb = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'https://seu-app.koyeb.app', '*', 'http://localhost:5000', "http://192.168.1.217:5000", 'https://ashamed-elfrida-thiagocmps-a0126839.koyeb.app/users/login', "http://192.168.1.217:8081","https://ashamed-elfrida-thiagocmps-a0126839.koyeb.app"], // ou um array: ['http://localhost:8081', 'http://192.168.1.217:8081']
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options('*', cors());
app.use(express.json());
app.use(utilities.auth);
app.use("/users", user_route);

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
