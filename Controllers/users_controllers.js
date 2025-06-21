const bcrypt = require("bcrypt");
const modelUser = require("../Models/users_model");
const utilities = require("../utilities/utilities.js");
/* const bodyParser = required("body-parser"); */
const nodemailer = require("nodemailer");
const Report = require("../Models/reports_model");
const Activity = require("../Models/activities_model");
const registrations = require("../Models/registrations_model");

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: "thiagocvsouza.dev@gmail.com",
    pass: "dzcj clbm djbw mvwl",
  },
  secure: true,
});

/* LOGIN */
const login = (req, res) => {
  modelUser
    .find({ email: req.body.email })
    .then((user) => {
      if (user.length > 0) {
        bcrypt
          .compare(req.body.password, user[0].password)
          .then((result) => {
            if (result) {
              utilities.generateToken(
                {
                  email: req.body.email,
                  role: user[0].role,
                  id: user[0]._id,
                  firstName: user[0].firstName,
                  lastName: user[0].lastName,
                  status: user[0].status,
                  createdAt: user[0].createdAt,
                },
                (token) => {
                  console.log(token);
                  res.status(200).json(token);
                }
              );
            } else {
              res.status(401).send("invalid Email or Password");
            }
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      } else {
        res.status(401).send("user not found");
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

/* REGISTER */
const register = (req, res) => {
  let isStudentEmail = false;
  let isProfessorEmail = false;
  let currentEmail;
  let numMecanografico;

  if (/^[0-9]{8}@esmad\.ipp\.pt$/.test(req.body.email)) {
    isStudentEmail = true; // Student email
    numMecanografico = req.body.email.substring(0, 8);
  }
  if (/^[a-zA-Z0-9._%+-]+@esmad\.ipp\.pt$/.test(req.body.email)) {
    isProfessorEmail = true; // Professor email
  }

  console.log(isStudentEmail, isProfessorEmail);

  if (!isStudentEmail && !isProfessorEmail) {
    return res
      .status(406)
      .send("Invalid email format. Must be a student or professor email.");
  } else if (!isStudentEmail && isProfessorEmail == true) {
    currentEmail = "professor";
  } else if (isStudentEmail == true) {
    currentEmail = "student";
  }

  if (req.body.password.length < 8) {
    return res.status(406).send("Password must be at least 8 characters long.");
  }
  if (req.body.firstName.length < 2) {
    return res
      .status(406)
      .send("First name must be at least 2 characters long.");
  }
  if (req.body.lastName.length < 2) {
    return res
      .status(406)
      .send("Last name must be at least 2 characters long.");
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      const userToCreate = new modelUser({
        email: req.body.email,
        password: hash,
        role: currentEmail,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        createdAt: Date.now(),
      });

      // find duplicate users
      modelUser
        .find({ email: req.body.email })
        .then((user) => {
          if (err) {
            res.status(400).send(err);
          }

          if (user.length > 0) {
            res.status(406).send("Duplicated User");
          } else {
            userToCreate.save().then(() => {
              if (err) {
                res.status(400).send(err);
              }
              res.status(200).send("Registered User");
            });
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    });
  });
};

const sendEmail = (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  const mailData = {
    from: "thiagocvsouza.dev@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Código de verificação: ", // Subject line
    text: "Aqui está o seu código de verificação: " + code, // plain text body
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
    res.status(200).send("Email sent successfully!");
  });
};

const getUserById = (req, res) => {
  modelUser
    .findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send("Utilizador não encontrado");
      }
    })
    .catch((error) => {});
};

const getAllUsers = (req, res) => {
  console.log("tamo dentro do getAllUsers");
  modelUser
    .find()
    .then((users) => {
            console.log("tamo dentro do .then")
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const patchUser = (req, res) => {
  modelUser
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send("Utilizador não encontrado");
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const deleteUser = (req, res) => {
  modelUser
    .findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
        Promise.all([
          Report.deleteMany({ userId: user._id }),
          Activity.deleteMany({ creatorId: user._id }),
          registrations.deleteMany({ creatorId: user._id })
        ])
          .then(() => {
            console.log("Associated reports, activities, and registrations deleted successfully.");
          })
          .catch((err) => {
            console.error("Error deleting associated data:", err);
          });
      } else {
        res.status(404).send("Utilizador não encontrado");
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

exports.deleteUser = deleteUser;
exports.patchUser = patchUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.register = register;
exports.login = login;
exports.sendEmail = sendEmail;
