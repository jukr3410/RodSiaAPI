const User = require("../models/user.model");
const Review = require("../models/review.model");
const ObjectId = require("mongodb").ObjectID;
const { json } = require("body-parser");

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  User.find()
    .select([])
    .limit(limit)
    .sort({
      _id: sort,
    })
    .populate([])
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
  // const id = req.params.id
  const id = new ObjectId(req.params.id);
  User.findById({
    _id: id,
  })
    .populate([])
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(404).json({
          message: "User not found with id " + id,
        });
      }
      res.status(500).json({
        message: "Error retrieving User with id " + id,
      });
    });
};

module.exports.getUserPhone = (req, res) => {
  const phone = req.params.phone;
  User.findOne({
    phone: phone,
  })
    .populate([])
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(404).json({
          message: "User not found with id " + phone,
        });
      }
      res.status(500).json({
        message: "Error retrieving User with id " + phone,
      });
    });
};

module.exports.addUser = (req, res) => {
  if (req.body == undefined) {
    res.status(400).json({
      message: "User content can not be empty",
    });
  } else {
    // let userCount = 0;
    // User.find().countDocuments(function (err, count) {
    //     userCount = count
    //   })
    //   .then(() => {
    const user = new User({
      // id: userCount + 1,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      otp: req.body.otp,
      validatePhone: req.body.validatePhone,
      cars: req.body.cars,
      profileImage: req.body.profileImage,
      // reviews: req.body.reviews,
      // requestServices: req.body.requestServices
    });
    user
      .save()
      .then((user) => {
        res.status(201).json({
          message: "Add user successfully.",
          user,
        });
      })
      .catch((err) => console.log(err));
    // res.status(500).json({
    //   message: err.message || "Some error occurred while creating the User."
    // });
    //res.json(user)
    // });
    // res.json({id:User.find().count()+1,...req.body})
  }
};

module.exports.editUser = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const phone = req.body.phone;
  console.log(phone);
  if (typeof req.body == undefined || phone == null) {
    res.json({
      status: "error",
      message: "user phone should be provided",
    });
  } else {
    await User.findOneAndUpdate(
      {
        phone: phone,
      },
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        otp: req.body.otp,
        validatePhone: req.body.validatePhone,
        cars: req.body.cars,
        profileImage: req.body.profileImage,
      }
    )
      .then((user) => {
        res.status(200).json({
          success: true,
          message: "Update user successfully.",
          user,
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          res.status(404).json({
            message: "User not found with phone " + phone,
          });
        }
        res.status(500).json({
          message: "Error updating User with phone " + phone,
        });
      });
  }
};
module.exports.editUserNoPassword = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const phone = req.body.phone;
  console.log(phone);
  if (typeof req.body == undefined || phone == null) {
    res.json({
      status: "error",
      message: "user phone should be provided",
    });
  } else {
    await User.findOneAndUpdate(
      {
        phone: phone,
      },
      {
        name: req.body.name,
        email: req.body.email,
        otp: req.body.otp,
        validatePhone: req.body.validatePhone,
        cars: req.body.cars,
        profileImage: req.body.profileImage,
      }
    )
      .then((user) => {
        res.status(200).json({
          success: true,
          message: "Update user successfully.",
          user,
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          res.status(404).json({
            message: "User not found with phone " + phone,
          });
        }
        res.status(500).json({
          message: "Error updating User with phone " + phone,
        });
      });
  }
};

module.exports.deleteUser = (req, res) => {
  const id = new ObjectId(req.params.id);
  const phone = req.body.phone;
  if (id == null) {
    res.json({
      status: "error",
      message: "user id should be provided",
    });
  } else {
    User.findOneAndRemove({
      phone: phone,
    })
      .then((user) => {
        res.status(200).json({
          success: true,
          message: "User deleted successfully!",
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          res.status(404).json({
            message: "User not found with id " + id,
          });
        }
        res.status(500).json({
          message: "Could not delete User with id " + id,
        });
      });
  }
};

// module.exports.updateUserCar = (req, res) => {
//   const id = new ObjectId(req.params.id);
//   if (typeof req.body == undefined || id == null) {
//     res.json({
//       status: "error",
//       message: "user id should be provided",
//     });
//   } else {
//     User.findByIdAndUpdate(
//       {
//         _id: id,
//       },
//       {
//         cars: req.body.cars
//       },
//       {
//         new: true,
//       }
//     )
//       .then((user) => {
//         if (!user) {
//            res.status(404).json({
//             message: "User not found with id " + id,
//           });
//         }
//         res
//           .status(200)
//           .json({
//             message: "Add car successfully.",
//             user,
//           })
//           .populate([]);
//       })
//       .catch((err) => {
//         if (err.kind === "ObjectId") {
//            res.status(404).json({
//             message: "User not found with id " + id,
//           });
//         }
//          res.status(500).json({
//           message: "Error updating User with id " + id,
//         });
//       });
//   }
// };
