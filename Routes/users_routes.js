const express = require("express");
const userRouter = express.Router();
const controllerUsers = require("../Controllers/users_controllers.js");
const { validationResult, body } = require("express-validator");
const utilities = require("../utilities/utilities.js");
/* Login */
userRouter.post("/login", function (req, res) {
  controllerUsers.login(req, res);
});

userRouter.post("/sendmail", function (req, res) {
  controllerUsers.sendEmail(req, res);
});

userRouter.get("/:id", function (req, res) {
  controllerUsers.getUserById(req, res);
});

userRouter.patch("/patch/:id", function (req, res) {
  controllerUsers.patchUser(req, res);
});
/* Register */
userRouter.post(
  "/register",
  [
    body("firstName").notEmpty().escape(),
    body("lastName").notEmpty().escape(),
    body("password").notEmpty().escape(),
    body("email").isEmail().normalizeEmail(),
  ],
  function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      controllerUsers.register(req, res);
    } else {
      res.status(404).json({ errors: errors.array() });
    }
  }
);

userRouter.get("/", function (req, res) {
  console.log("o caminho tá certo pelo menos");
  controllerUsers.getAllUsers(req, res);
});

userRouter.delete("/delete/:id", function (req, res) {
  controllerUsers.deleteUser(req, res);
});

module.exports = userRouter;