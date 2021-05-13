const User = require('../models/user.model')
const Review = require("../models/review.model")
const ObjectId = require('mongodb').ObjectID
const {
  json
} = require('body-parser')


module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  User.find().select(['-_id']).limit(limit).sort({
      _id: sort
    }).populate(["reviews","requestServices"])
    .then(users => {
      res.json(users)
    })
    .catch(err => console.log(err))
}

module.exports.getUser = (req, res) => {
  // const id = req.params.id
  const id = new ObjectId(req.params.id)
  User.findById({
      "_id": id
    }).populate(["reviews","requestServices"])
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with id " + id
        });
      }
      return res.status(500).send({
        message: "Error retrieving User with id " + id
      });
    });
}



module.exports.addUser = (req, res) => {
  if (req.body == undefined) {
    return res.status(400).send({
      message: "User content can not be empty"
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
      validatePhone: req.body.validatePhone,
      cars: {
        brand: req.body.cars.brand,
        model: req.body.cars.model,
        type: req.body.cars.type,
        year: req.body.cars.year
      },
      reviews: req.body.reviews,
      requestServices: req.body.requestServices
    });
    user.save()
      .then(user => res.json(user))
      .catch(err => console.log(err))
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User."
    });
    res.json(user)
    // });
    // res.json({id:User.find().count()+1,...req.body})
  }
}

module.exports.editUser = (req, res) => {
  const id = new ObjectId(req.params.id)
  if (typeof req.body == undefined || id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    User.findByIdAndUpdate({
        "_id": id
      }, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        validatePhone: req.body.validatePhone,
        cars: [{
          brand: req.body.cars.brand,
          model: req.body.cars.model,
          type: req.body.cars.type,
          year: req.body.cars.year
        }],
        reviews: req.body.reviews,
        requestServices: req.body.requestServices
      }, {
        new: true
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: "User not found with id " + id
          });
        }
        res.send(user).populate(["reviews","requestServices"]);
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            message: "User not found with id " + id
          });
        }
        return res.status(500).send({
          message: "Error updating User with id " + id
        });
      });

  }
}

module.exports.deleteUser = (req, res) => {
  const id = new ObjectId(req.params.id)
  if (id == null) {
    res.json({
      status: "error",
      message: "user id should be provided"
    })
  } else {
    User.findByIdAndRemove({
        "_id": id
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: "User not found with id " + id
          });
        }
        res.send({
          message: "User deleted successfully!"
        });
      }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
            message: "User not found with id " + id
          });
        }
        return res.status(500).send({
          message: "Could not delete User with id " + id
        });
      });
  }
}