const express = require("express");
const userRouter = express.Router();
const controllerUsers = require('../Controllers/users_controllers.js')
const { validationResult, body } = require('express-validator')

/* Login */
userRouter.post('/login', function (req, res) {
    controllerUsers.login(req, res);
});

userRouter.post('/sendmail', function (req, res) {
    controllerUsers.sendEmail(req, res);
});

/* Register */
userRouter.post('/register', [
    body('firstName').notEmpty().escape(),
    body('lastName').notEmpty().escape(),
    body('password').notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
],  function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        controllerUsers.register(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
});



module.exports = userRouter;