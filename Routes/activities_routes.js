const express = require("express");
const activityRouter = express.Router();
const controllerActivities = require("../Controllers/activities_controllers.js");
const controllerRegistrations = require("../Controllers/registrations_controllers.js");
const utilities = require("../utilities/utilities.js");

/* REGISTRATION */
activityRouter.post("/registrations/add", function (req, res) {
  controllerRegistrations.addRegistration(req, res);
});/* FEITO */

activityRouter.get("/registrations/user", function (req, res) {
  controllerRegistrations.getRegistrationByUser(req, res);
});/* FEITO */

activityRouter.get("/registrations", function (req, res) {
  controllerRegistrations.getAllRegistrations(req, res);
}); /* FEITO */

activityRouter.get("/registrations/filter", function (req, res) {
  controllerRegistrations.getFilterRegistration(req, res);
});


/* ACTIVITY */
activityRouter.get(
  "/",
  function (req, res) {
    controllerActivities.getAllActivities(req, res);
  }
);

activityRouter.post(
  "/add",
  utilities.isProfessor,
  function (req, res) {
    controllerActivities.addActivity(req, res);
  }
);

activityRouter.delete(
  "/delete/:id",
  utilities.isProfessor,
  function (req, res) {
    controllerActivities.deleteActivity(req, res);
  }
);

activityRouter.put(
  "/update/:id",
  utilities.isProfessor,
  function (req, res) {
    controllerActivities.updateActivity(req, res);
  }
);
module.exports = activityRouter;
