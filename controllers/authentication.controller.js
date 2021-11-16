require("dotenv").config();
const User = require("../models/user.model");
const mongoose = require("mongoose");
const UsersDto = require("../dtos/responses/users.dto");
const AppResponseDto = require("../dtos/responses/app_response.dto");
const session = require("express-session");
const Garage = require("../models/garage.model");
const jwt = require("jsonwebtoken");
const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "242f2e02",
  apiSecret: "mL6sm5MakJwO6MVb",
});

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
      console.log("check phone garage: " + garage);
      if (garage == null) {
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
  await user
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
  const validatePhone = req.body.validatePhone;


  garage = new Garage({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    otp: req.body.otp,
    validatePhone: req.body.validatePhone,
    logoImage: req.body.logoImage,
  });
  await garage
    .save()
    .then((garage) => {
      if (garage) {
        console.dir(garage);
        console.log(garage.toJSON());
        res.send(UsersDto.registerDto(garage));
      } else {
        console.log("garage is empty ...???");
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

module.exports.sendOtpUser = async (req, res) => {
  const phone = req.body.phone;
  console.log(phone);
  if (typeof req.body == undefined || phone == null) {
    res.json({
      status: "error",
      message: "user phone should be provided",
    });
  } else {

    var digit = Math.floor(1000 + Math.random() * 9000);
    var digit_temp = digit;
    const from = "Rodsia";
    var to = "66" + phone.substring(1);
    var text = digit_temp + " is your Rodsia register code.";
  
    vonage.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    });
    
    await User.findOneAndUpdate(
      {
        phone: phone,
      },
      {
        otp: digit_temp.toString(),
      },
      
      
    ).then((user) => {
      


        console.log(user.toJSON());
        res
          .status(200)
          .json({
            message: "Update user OTP successfully.",
            user,
          });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
           res.status(404).json({
            message: "User not found with id " + phone,
          });
        }
         res.status(500).json({
          message: "Error updating User OTP with id " + phone,
        });
      });
  }
};

module.exports.sendOtpGarage = async (req, res) => {
  const phone = req.body.phone;
  console.log(phone);
  if (typeof req.body == undefined || phone == null) {
    res.json({
      status: "error",
      message: "garage phone should be provided",
    });
  } else {

    var digit = Math.floor(1000 + Math.random() * 9000);

    const from = "Rodsia";
    var to = "66" + phone.substring(1);
    var text = digit.toString() + " is your Rodsia garage register code.";
  
    vonage.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    });
    
    await Garage.findOneAndUpdate(
      {
        phone: phone,
      },
      {
        otp: digit.toString(),
      },
      
      
    ).then((garage) => {
      

        // if (!garage) {
        //    res.status(404).json({
        //     message: "Garage not found with id " + phone,
        //   });
        // }
        res
          .status(200)
          .json({
            message: "Update garage OTP successfully.",
            garage,
          });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
           res.status(404).json({
            message: "Garage not found with id " + phone,
          });
        }
         res.status(500).json({
          message: "Error updating Garage OTP with id " + phone,
        });
      });
  }
};

module.exports.verifyOtpUser = async (req, res) => {
  
  const phone = req.body.phone;
  const otp = req.body.otp;

  console.log("Phone: "+ phone + ", Otp: "+otp);
  await User.findOne({
    phone: phone,
  })
    .populate([])
    .then((user) => {
      var success = false;
      var message = "Error invalid User OTP";
      console.log(user.toJSON());
      //console.log("User res otp: "+user.otp);
      if (user.otp == otp) {
        console.log("Verify Success");
        success = true;
        message = "Success";
      }
      res.status(200).json({
        success: success,
        message: message,
        user
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
         res.status(404).json({
          message: "User not found with phone " + phone,
        });
      }
       res.status(500).json({
        message: "Error retrieving User with phone " + phone,
      });
    });
};

module.exports.verifyOtpGarage = async (req, res) => {
  
  const phone = req.body.phone;
  const otp = req.body.otp;
  
  await Garage.findOne({
    phone: phone,
  })
    .populate([])
    .then((garage) => {
      var success = false;
      var message = "Error invalid Garage OTP";
      if (garage.otp == otp) {
        success = true;
        message = "Success";
      }
      res.status(200).json({
        success: success,
        message: message,
        user
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
         res.status(404).json({
          message: "Garage not found with phone " + phone,
        });
      }
       res.status(500).json({
        message: "Error retrieving Garage with phone " + phone,
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
            expiresIn: "30d",
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
        message: "Garage not found with that " + phone,
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
            expiresIn: "30d",
          }
        );

        res.status(200).json({
          message: "Login Success",
          garage,
          token,
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
