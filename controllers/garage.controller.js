const Garage = require("../models/garage.model");
const Service = require("../models/service.model");
const ServiceType = require("../models/serviceType.model");
const Review = require("../models/review.model");

const ObjectId = require("mongodb").ObjectID;

module.exports.getAllGarage = (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit) || 15;
  const skipIndex = (page - 1) * limit;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Garage.find()
    .select([])
    .limit(limit)
    .skip(skipIndex)
    .sort({
      _id: sort,
    })
    .populate([])
    .then((garages) => {
      res.status(200).json(garages);
    })
    .catch((err) => console.log(err));
};

module.exports.getGarage = (req, res) => {
  const id = new ObjectId(req.params.id);
  Garage.findById({
    _id: id,
  })
    .then((garage) => {
      res.status(200).json(garage);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Garage not found with id " + id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving Garage with id " + id,
      });
    });
};

module.exports.addGarage = (req, res) => {
  if (req.body == undefined) {
    return res.status(400).send({
      message: "Garage content can not be empty",
    });
  } else {
    // let garageCount = 0;
    // Garage.find().countDocuments(function (err, count) {
    //         garageCount = count
    //     })
    //     .then(() => {
    const garage = new Garage({
      // id: garageCount + 1,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      otp: req.body.password,
      validatePhone: req.body.validatePhone,
      address: {
        addressDesc: req.body.address.addressDesc,
        geoLocation: {
          lat: req.body.address.geoLocation.lat,
          long: req.body.address.geoLocation.long,
        },
      },
      openStatus: req.body.openStatus,
      openingHour: req.body.openingHour,
      openingDayOfWeek: req.body.openingDayOfWeek,
      logoImage: req.body.logoImage,
      images: req.body.images,
      typeCarRepairs: req.body.typeCarRepairs,
    });
    garage
      .save()
      .then(
        res.status(201).json({
          success: true,
          message: "Add garage successfully.",
          garage: garage,
        })
      )
      .catch((err) => console.log(err));

    //res.json(garage)
    // });

    // res.json({id:Garage.find().count()+1,...req.body})
  }
};

module.exports.editGarage = (req, res) => {
  const id = new ObjectId(req.params.id);
  const phone = req.body.phone;
  if (typeof req.body == undefined || id == null) {
    res.json({
      success: false,
      message: "garage id should be provided",
    });
  } else {
    Garage.findOneAndUpdate(
      {
        phone: phone,
      },
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        otp: req.body.password,
        validatePhone: req.body.validatePhone,
        address: req.body.address,
        openingHour: req.body.openingHour,
        openingDayOfWeek: req.body.openingDayOfWeek,
        logoImage: req.body.logoImage,
        images: req.body.images,
        typeCarRepairs: req.body.typeCarRepairs,
      }
    )
      .then((garage) => {
        res.status(200).json({
          success: true,
          message: "Update garage successfully.",
          garage: garage,
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            success: false,
            message: "Garage not found with phone " + phone,
          });
        }
        return res.status(500).send({
          success: false,
          message: "Error updating Garage with phone " + phone,
        });
      });
  }
};

module.exports.editGaragePassword = async (req, res) => {
  // const id = new ObjectId(req.params.id);
  const phone = req.body.phone;
  const password = req.body.password;
  console.log(phone);
  if (typeof req.body == undefined || phone == null || password == null) {
    res.json({
      status: "error",
      message: "user phone or password should be provided",
    });
  } else {
    await Garage.findOneAndUpdate(
      {
        phone: phone,
      },
      {
        password: req.body.password,
      }
    )
      .then((user) => {
        res.status(200).json({
          success: true,
          message: "Update garage successfully.",
          user,
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          res.status(404).json({
            message: "garage not found with phone " + phone,
          });
        }
        res.status(500).json({
          message: "Error updating garage with phone " + phone,
        });
      });
  }
};
module.exports.editGarageNoPassword = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const phone = req.body.phone;
  console.log(phone);
  if (typeof req.body == undefined || phone == null) {
    res.json({
      status: "error",
      message: "user phone should be provided",
    });
  } else {
    await Garage.findOneAndUpdate(
      {
        phone: phone,
      },
      {
        name: req.body.name,
        email: req.body.email,
        otp: req.body.password,
        validatePhone: req.body.validatePhone,
        address: req.body.address,
        openingHour: req.body.openingHour,
        openingDayOfWeek: req.body.openingDayOfWeek,
        logoImage: req.body.logoImage,
        images: req.body.images,
        typeCarRepairs: req.body.typeCarRepairs,
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

module.exports.deleteGarage = (req, res) => {
  const id = new ObjectId(req.params.id);
  const phone = req.body.phone;
  if (id == null) {
    res.json({
      status: "error",
      message: "garage id should be provided",
    });
  } else {
    Garage.findOneAndRemove({
      phone: phone,
    })
      .then((garage) => {
        res.status(200).json({
          success: true,
          message: "Garage deleted successfully! " + phone,
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            success: false,
            message: "Garage not found with phone " + phone,
          });
        }
        return res.status(500).send({
          success: false,
          message: "Could not delete Garage with phone " + phone,
        });
      });
  }
};

module.exports.getByGarageName = (req, res) => {
  const name = req.params.name;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit) || 15;
  const skipIndex = (page - 1) * limit;
  const sort = req.query.sort == "desc" ? -1 : 1;

  if (name == null) {
    req.json({
      status: "error",
      message: "Garage name should be provided",
    });
  } else {
    const query = {
      name: {
        // "$regex": new RegExp(name, "i")
        $regex: name,
        $options: "i",
      },
    };

    Garage.find(query)
      .limit(limit)
      .skip(skipIndex)
      .sort({
        _id: sort,
      })
      .then((garage) => {
        res.json(garage);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

module.exports.updateOpenStatusGarage = (req, res) => {
  const id = new ObjectId(req.params.id);

  if (typeof req.body == undefined || id == null) {
    res.json({
      success: false,
      message: "garage id should be provided",
    });
  } else {
    Garage.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        openStatus: req.body.openStatus,
      },
      {
        new: true,
      }
    )
      .then((garage) => {
        if (!garage) {
          return res.status(404).send({
            success: false,
            message: "Garage not found with id " + id,
          });
        }
        res.status(200).json({
          success: true,
          message: "Update garage successfully.",
          garage: garage,
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            success: false,
            message: "Garage not found with id " + id,
          });
        }
        return res.status(500).send({
          success: false,
          message: "Error updating Garage with id " + id,
        });
      });
  }
};

module.exports.getGaragePhone = (req, res) => {
  const phone = req.params.phone;
  Garage.findOne({
    phone: phone,
  })
    .populate([])
    .then((garage) => {
      res.status(200).json(garage);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(404).json({
          message: "User not found with phone " + phone,
        });
      }
      res.status(500).json({
        message: "Error retrieving Garage with phone " + phone,
      });
    });
};

module.exports.getAllGarageByQuery = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit) || 15;
  const skipIndex = (page - 1) * limit;
  const sort = req.query.sort == "desc" ? -1 : 1;

  const serviceType = req.query.serviceType;
  const carType = req.query.carType;
  const currentLat = req.query.lat;
  const currentLong = req.query.long;

  console.log(serviceType + " : " + carType);

  var query = {};

  if (
    carType != "" &&
    carType != null &&
    serviceType != "" &&
    serviceType != null
  ) {
    //filter service types
    const selectedServiceType = await ServiceType.findOne({
      name: serviceType,
    }).exec();

    const garageIdHaveServices = await Service.find({
      serviceType: selectedServiceType._id,
    })
      .select(["garage"])
      .exec();

    console.log("garageIdHaveServices:\n", garageIdHaveServices);

    const garageIds = garageIdHaveServices.map((garage) => garage.garage);

    query = {
      $and: [
        {
          "typeCarRepairs.type": carType,
        },
        { _id: { $in: garageIds } },
      ],
    };
  }

  console.log("query:\n", query);

  Garage.find(query)
    .select([])
    .limit(limit)
    .skip(skipIndex)
    .populate([])
    .then(async (garages) => {
      if (
        currentLat != "" &&
        currentLat != null &&
        currentLong != "" &&
        currentLong != null
      ) {
        var garagesInRadius = [];
        const radius = 50;
        for (let garage of garages) {
          console.log("Geo: ", garage.address.geoLocation);
          var distance = await this.getDistanceFromLatLongInKm(
            parseFloat(currentLat),
            parseFloat(currentLong),
            parseFloat(garage.address.geoLocation.lat),
            parseFloat(garage.address.geoLocation.long)
          );
          console.log("Distance: " + distance.toFixed(1));
          if (distance.toFixed(1) < radius) {
            console.log("garage id: " + garage._id);
            // get all review by garage
            const reviews = await Review.find({ garage: garage._id }).exec();
            // cal review star
            let reviewScoreList = await reviews.map((review) => review.star);
            const reviewScoreTotal = await reviewScoreList.reduce(
              (a, b) => a + b,
              0
            );
            console.log(
              "reviewScoreTotal: " +
                reviewScoreTotal +
                " / " +
                reviewScoreList.length
            );
            var reviewScoreP = 0;
            if (reviewScoreList.length != 0) {
              reviewScoreP = reviewScoreTotal / reviewScoreList.length;
            }
            const services = await Service.find({garage: garage._id})
              .populate(["serviceType"])
              .exec();

            // parse to json for add new field
            var garageJson = JSON.parse(JSON.stringify(garage));
            garageJson.reviewStar = reviewScoreP.toFixed(1);
            garageJson["serviceInGarages"] = services;
            garagesInRadius.push(garageJson);
          }
        }
      }

      res.status(200).json(garagesInRadius);
    })
    .catch((err) => console.log(err));
};

module.exports.updateProfileImageGarage = async (phone, profileImage) => {
  console.log("profileImage: " + profileImage);
  const garage = await Garage.findOneAndUpdate(
    {
      phone: phone,
    },
    {
      logoImage: profileImage,
    },

    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated profileImage : ", docs);
      }
    }
  ).exec();
  return garage;
};

module.exports.updateImageListGarage = async (phone, imageInput) => {
  console.log("imageInput: " + imageInput);
  const garage = await Garage.findOneAndUpdate(
    {
      phone: phone,
    },
    {
      $addToSet: { images: { $each: [{ image: imageInput }] } },
    },

    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        //console.log("Updated Images : ", res.images);
        console.log("Updated Images.");
      }
    }
  ).exec();
  return garage;
};

module.exports.getDistanceFromLatLongInKm = async (
  lat1,
  long1,
  lat2,
  long2
) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLong = deg2rad(long2 - long1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance in km
  return distance;
};
// function getDistanceFromLatLongInKm(lat1, long1, lat2, long2) {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2 - lat1); // deg2rad below
//   var dLong = deg2rad(long2 - long1);
//   var a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLong / 2) *
//       Math.sin(dLong / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var distance = R * c; // Distance in km
//   return distance;
// }

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
