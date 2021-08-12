const Garage = require("../models/garage.model");
const ObjectId = require("mongodb").ObjectID;

const FileUpload = require("../models/fileUpload.model");

module.exports.getAllGarage = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Garage.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      _id: sort,
    })
    .populate(["services", "reviews", "images"])
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
    .populate(["services", "reviews", "images"])
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
      validatePhone: req.body.validatePhone,
      address: {
        addressDesc: req.body.address.addressDesc,
        geolocation: {
          lat: req.body.address.geolocation.lat,
          long: req.body.address.geolocation.long,
        },
      },
      services: req.body.services,
      reviews: req.body.reviews,
    });
    garage
      .save()
      .then(
        res.status(200).json({
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
  if (typeof req.body == undefined || id == null) {
    res.json({
        success: false,
      message: "something went wrong! check your sent data",
    });
  } else {
    Garage.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        validatePhone: req.body.validatePhone,
        address: req.body.address,
        images: req.body.images,
        services: req.body.services,
        reviews: req.body.reviews,
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
            garage: garage});
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

module.exports.deleteGarage = (req, res) => {
  const id = new ObjectId(req.params.id);
  if (id == null) {
    res.json({
      status: "error",
      message: "garage id should be provided",
    });
  } else {
    Garage.findByIdAndRemove({
      _id: id,
    })
      .then((garage) => {
        if (!garage) {
          return res.status(404).send({
            success: false,
            message: "Garage not found with id " + id,
          });
        }
        res.status(200).json({
            success: true,
            message: "Garage deleted successfully!",
            garage: garage});
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            success: false,
            message: "Garage not found with id " + id,
          });
        }
        return res.status(500).send({
            success: false,
          message: "Could not delete Garage with id " + id,
        });
      });
  }
};
module.exports.getByGarageName = (req, res) => {
  const name = req.params.name;
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
      .populate(["services", "reviews"])
      .then((garage) => {
        res.json(garage);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
