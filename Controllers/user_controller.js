const bcrypt = require("bcrypt");
const modelUser = require("../Models/user_model");
const utilities = require("../utilities/utilities.js")


/* LOGIN */
const login = (req, res) => {
  modelUser
    .find({ email: req.body.email })
    .then(user => {
      if (user.length > 0) {
        bcrypt
          .compare(req.body.password, user[0].password)
          .then(result => {
            if (result) {
              /* console.log(result); */
              utilities.generateToken(
                { email: req.body.username, role: user[0].role, id: user[0]._id },
                token => {
                  console.log(token);
                  res.status(200).json(token);
                }
              );
            } else {
              res.status(401).send("invalid Email or Password");
            }
          }) .catch((error) => {
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
  let currentEmail
  let numMecanografico

  if (/^[0-9]{8}@esmad\.ipp\.pt$/.test(req.body.email)) {
    isStudentEmail = true; // Student email
    numMecanografico = req.body.email.substring(0, 8);
  } 
   if (/^[a-zA-Z0-9._%+-]+@esmad\.ipp\.pt$/.test(req.body.email)) {
    isProfessorEmail = true; // Professor email
  }
  
  console.log(isStudentEmail, isProfessorEmail);

  if (!isStudentEmail && !isProfessorEmail) {
    return res.status(406).send("Invalid email format. Must be a student or professor email.");
  } else if (!isStudentEmail && isProfessorEmail == true) {
    currentEmail = "professor";
  } else if (isStudentEmail == true) {
    currentEmail = "student";
  }

  if (req.body.password.length < 8) {
    return res.status(406).send("Password must be at least 8 characters long.");
  }
  if (req.body.firstName.length < 2) {
    return res.status(406).send("First name must be at least 2 characters long.");
  }
  if (req.body.lastName.length < 2) {
    return res.status(406).send("Last name must be at least 2 characters long.");
  }


  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      const userToCreate = new modelUser({
        email: req.body.email,
        password: hash,
        role: currentEmail,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        numMecanografico: numMecanografico,
        createdAt: Date.now(),
      });

      // find duplicate users
      modelUser
        .find({ email: req.body.email })
        .then(user => {
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

const validateEmail = (req, res) => {
  const email = req.body.email;
  
};

exports.register = register;
exports.login = login;
