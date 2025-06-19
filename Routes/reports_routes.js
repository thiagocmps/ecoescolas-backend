const utilities = require("../utilities/utilities.js");
const controllerReports = require("../Controllers/reports_controllers.js");
const express = require("express");
const reportsRouter = express.Router();

reportsRouter.get("/all", utilities.isWorker, function (req, res) {
  controllerReports.getAllReports(req, res);
});

reportsRouter.get("/", function (req, res) {
  controllerReports.getAllReportsByUser(req, res);
});

reportsRouter.post("/create", function (req, res) {
  controllerReports.createReport(req, res);
});

reportsRouter.delete("/delete/:id", function (req, res) {
  controllerReports.deleteReport(req, res);
});

reportsRouter.patch("/update/:id", function (req, res) {
  controllerReports.updateReport(req, res);
})

reportsRouter.get("/:id", function (req, res) {
  controllerReports.getReportByUserId(req, res);
});

module.exports = reportsRouter;
