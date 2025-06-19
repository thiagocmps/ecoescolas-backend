const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
const utilities = require("../utilities/utilities");
const userRoute = require("../Routes/users_routes");
const activityRoute = require("../Routes/activities_routes");
const reportsRouter = require("../Routes/reports_routes");

require("dotenv").config();

const urimongodb = process.env.MONGO_URI;

const app = express();

// Configuração de CORS
app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:5000",
      "http://192.168.1.217:8081",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Conecta ao MongoDB apenas uma vez
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    try {
      await mongoose.connect(urimongodb);
      console.log("Base de dados conectada");
      isConnected = true;
    } catch (err) {
      console.error("Erro ao conectar ao MongoDB:", err);
    }
  }
}

// Middleware para garantir conexão ativa
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Middleware de autenticação e rotas
app.use(utilities.auth);
app.use("/users", userRoute);
app.use("/activities", activityRoute);
app.use("/reports", reportsRouter);

// Exporta como função Serverless
module.exports = app;
module.exports.handler = serverless(app);
