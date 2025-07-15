const utilities = require("../utilities/utilities.js");
const controllerMontlhyReports = require("../Controllers/monthly_expense_controllers.js")
const express = require("express");
const reportsRouter = express.Router();

reportsRouter.get("/all", function (req, res) {
  controllerMontlhyReports.getAllReports(req, res);
});

module.exports = reportsRouter;
