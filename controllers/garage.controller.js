const Garage = require("../models/garage.model");
const ObjectId = require("mongodb").ObjectID;

const FileUpload = require("../models/fileUpload.model");

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
        geolocation: {
          lat: req.body.address.geolocation.lat,
          long: req.body.address.geolocation.long,
        },
      },
      openStatus: req.body.openStatus,
      openingHour: req.body.openingHour,
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
          message: "Garage deleted successfully! "+ phone,
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

  const serviceTypes = req.query.serviceTypes || [];
  const carTypes = req.query.carTypes || [];

  Garage.find({})
    .select([])
    .limit(limit)
    .skip(skipIndex)
    .populate([])
    .then((garages) => {
      res.status(200).json(garages);
    })
    .catch((err) => console.log(err));
};
