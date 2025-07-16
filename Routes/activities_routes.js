const express = require("express");
const activityRouter = express.Router();
const controllerActivities = require("../Controllers/activities_controllers.js");
const controllerRegistrations = require("../Controllers/registrations_controllers.js");
const utilities = require("../utilities/utilities.js")  ;

/* REGISTRATION */
activityRouter.post("/registrations/add", function (req, res) {
  controllerRegistrations.addRegistration(req, res);
}); /* FEITO */

activityRouter.get("/registrations/user", function (req, res) {
  controllerRegistrations.getRegistrationByUser(req, res);
}); /* FEITO */

activityRouter.get("/registrations/user/one", function (req, res) {
  controllerRegistrations.getRegistrationByActivityIdUserId(req, res)
})

activityRouter.get("/registrations", function (req, res) {
  controllerRegistrations.getAllRegistrations(req, res);
}); /* FEITO */

activityRouter.put("/registrations/update", function (req, res) {
  controllerRegistrations.updateRegistration(req, res);
});

activityRouter.get("/registrations/filter", function (req, res) {
  controllerRegistrations.getFilterRegistration(req, res);
});

activityRouter.get("/registrations/checkStatus/:id", function (req, res) {
  controllerRegistrations.isRegistrationValidated(req, res);
});

/* activityRouter.delete(
  "/registrations/delete/:id",
  utilities.isProfessor,
  function (req, res) {
    controllerRegistrations.deleteRegistration(req, res);
  }
); */
activityRouter.delete(
  "/registrations/delete",
  utilities.isProfessor,
  function (req, res) {
    controllerRegistrations.deleteRegistrationByUser(req, res);
  }
);


/* ACTIVITY */
activityRouter.get("/", function (req, res) {
  controllerActivities.getAllActivities(req, res);
});

activityRouter.get("/members/:id", function (req, res) {
  controllerActivities.getAllMembers(req, res);
});

activityRouter.post("/add", utilities.isProfessor, function (req, res) {
  controllerActivities.addActivity(req, res);
});

activityRouter.delete(
  "/delete/:id",
  utilities.isProfessor,
  function (req, res) {
    controllerActivities.deleteActivity(req, res);
  }
);

activityRouter.patch("/update/:id", utilities.isProfessor, function (req, res) {
  controllerActivities.updateActivity(req, res);
});
module.exports = activityRouter;
