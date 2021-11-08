require("dotenv").config();
const User = require("../models/user.model");
const mongoose = require("mongoose");
const UsersDto = require("../dtos/responses/users.dto");
const AppResponseDto = require("../dtos/responses/app_response.dto");
const session = require("express-session");
const Garage = require("../models/garage.model");
const jwt = require("jsonwebtoken");

const isEmpty = function (obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
module.exports.checkPhoneUser = (req, res) => {
  const errors = {};
  const phone = req.body.phone;
  User.findOne({
    phone,
  })
    .then((user) => {
      console.log("check phone user: " + user);
      if (user == null) {
        errors.phone = "phone number is not exists";

        // return res.status(422).json({success: false, errors});
        console.dir(errors.phone);
        // console.log(errors.phone)
        res.json(AppResponseDto.buildWithErrorMessages(errors));
        return false;
      } else {
        res.json(
          AppResponseDto.buildSuccessWithMessages(`Phone: ${phone} is already.`)
        );
        return true;
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        full_messages: err,
      });
    });
};
module.exports.checkPhoneGarage = (req, res) => {
  const errors = {};
  const phone = req.body.phone;
  Garage.findOne({
    phone,
  })
    .then((garage) => {
      if (garage !== null) {
        if (garage.phone === phone)
          errors.phone = "Phone: " + phone + " is not exits";
        if (!isEmpty(errors)) {
          // return res.status(422).json({success: false, errors});
          console.dir(errors.phone);
          // console.log(errors.phone)
          res.json(AppResponseDto.buildWithErrorMessages(errors));
          return false;
        }
      } else {
        res.json(
          AppResponseDto.buildSuccessWithMessages(`Phone: ${phone} is already.`)
        );
        return true;
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        full_messages: err,
      });
    });
};

module.exports.registerUser = async (req, res) => {
  const errors = {};

  const phone = req.body.phone;
  const validatePhone = req.body.validatePhone;

  user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    otp: req.body.otp,
    validatePhone: req.body.validatePhone,
    cars: req.body.cars,
    profileImage: req.body.profileImage,
  });
  user
    .save()
    .then((user) => {
      if (user) {
        console.dir(user);
        console.log(user.toJSON());
        res.send(UsersDto.registerDto(user));
      } else {
        console.log("user is empty ...???");
        res.json(AppResponseDto.buildWithErrorMessages("something went wrong"));
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        full_messages: err,
      });
    });
};

module.exports.registerGarage = async (req, res) => {
  const errors = {};
  const phone = req.body.phone;
  const email = req.body.email;
  const validatePhone = req.body.validatePhone;
  if (req.body == undefined) {
    return res.status(400).send({
      message: "User content can not be empty",
    });
  }
  Garage.findOne({
    $or: [
      {
        email,
      },
      {
        phone,
      },
    ],
  })
    .then((garage) => {
      if (garage !== null) {
        if (garage.phone === phone)
          errors.phone = "Phone: " + phone + " is not exits";
        if (garage.email === email)
          errors.email = "Email: " + email + " is already taken";
        if (!isEmpty(errors)) {
          // return res.status(422).json({success: false, errors});
          console.log(errors.email);
          return res.json(AppResponseDto.buildWithErrorMessages(errors));
        }
      }
      if (validatePhone !== true) {
        errors.phone =
          "phone: " + phone + " must validate phone before register ";
      } else {
        garage = new Garage({
          phone: phone,
        });
        garage
          .save()
          .then((garage) => {
            if (garage) {
              console.dir(garage);
              console.log(garage.toJSON());
              res.json(UsersDto.registerDto(garage));
            } else {
              console.log("user is empty ...???");
              res.json(
                AppResponseDto.buildWithErrorMessages("something went wrong")
              );
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        full_messages: err,
      });
    });
};

module.exports.loginUser = async (req, res) => {
  try {
    const phone = req.body.phone;
    const password = req.body.password;
    const user = await User.findOne({
      phone,
    });
    if (!user) {
      res.status(404).send({
        message: "User not found with that " + phone,
      });
    } else {
      let encrypt = await User.isValidPassword(password, user.password);
      if (encrypt == true) {
        // session.loginUser = true
        // session.phone = phone

        // Create token
        const token = jwt.sign(
          {
            phone: user.phone,
            password: user.id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        //user.token = token;

        res.status(200).json({
          message: "Login Success",
          token,
          user,
        });
        console.dir(user);
        console.log(user.toJSON());
      } else {
        res.status(401).json({
          message: "Invalid password",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      full_messages: err,
    });
  }
};

module.exports.loginGarage = async (req, res) => {
  try {
    const phone = req.body.phone;
    const password = req.body.password;
    const garage = await Garage.findOne({
      phone,
    });
    if (!garage) {
      res.status(404).send({
        message: "User not found with that " + phone,
      });
    } else {
      let encrypt = await Garage.isValidPassword(password, garage.password);
      if (encrypt == true) {
        // session.loginGarage = true
        // session.phone = phone

        const token = jwt.sign(
          {
            phone: garage.phone,
            password: garage.id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "2h",
          }
        );

        res.status(200).json({
          message: "Login Success",
          garage,
          token
        });
        console.dir(garage);
        console.log(garage.toJSON());
      } else {
        res.status(401).json({
          message: "Invalid password",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      full_messages: err,
    });
  }
};

module.exports.logout = (req, res) => {
  if (session) {
    session.destroy(() => {
      req.logout();
    });
  }
};

module.exports.getSession = (req, res) => {
  console.log(sess);
  if (!session) {
    res.send({
      message: "Do not have session.",
    });
  } else {
    res.status(200).send("Phone = " + session.phone);
  }
};
