const RequestService = require("../models/requestService.model");
const Service = require("../models/service.model");
const ObjectId = require("mongodb").ObjectID;

module.exports.getAllRequestService = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  RequestService.find()
    .select([])
    .limit(limit)
    .sort({
      _id: sort,
    })
    .populate([
      "user",
      {
        path: "service",
        populate: [
          {
            path: "garage",
          },
          {
            path: "serviceType",
          },
        ],
      },
    ])
    .then((requestServices) => {
      res.json(requestServices);
    })
    .catch((err) => console.log(err));
};

module.exports.getRequestService = (req, res) => {
  const id = new ObjectId(req.params.id);
  RequestService.findById({
    _id: id,
  })
    .populate([
      "user",
      {
        path: "service",
        populate: [
          {
            path: "garage",
          },
          {
            path: "serviceType",
          },
        ],
      },
    ])
    .then((requestService) => {
      res.status(200).json(requestService);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "RequestService not found with id " + id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving RequestService with id " + id,
      });
    });
};
module.exports.getRequestByUserId = (req, res) => {
  const id = new ObjectId(req.params.id);
  RequestService.find({
    user: id,
  })
    .populate([
      "user",
      {
        path: "service",
        populate: [
          {
            path: "garage",
          },
          {
            path: "serviceType",
          },
        ],
      },
    ])
    .then((requestService) => {
      // getGarage;
      res.status(200).json(requestService);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "RequestService not found with id " + id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving RequestService with id " + id,
      });
    });
};
module.exports.getRequestByServiceId = (req, res) => {
  const id = new ObjectId(req.params.id);
  RequestService.find({
    service: id,
  })
    .populate([
      "user",
      {
        path: "service",
        populate: [
          {
            path: "garage",
          },
          {
            path: "serviceType",
          },
        ],
      },
    ])
    .then((requestService) => {
      // getGarage;
      res.status(200).json(requestService);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "RequestService not found with id " + id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving RequestService with id " + id,
      });
    });
};

module.exports.addRequestService = async (req, res) => {
  if (req.body == undefined) {
    return res.status(400).send({
      message: "RequestService content can not be empty",
    });
  } else {
    // let requestServiceCount = 0;
    // RequestService.find().countDocuments(function (err, count) {
    //         requestServiceCount = count
    //     })
    //     .then(() => {

    const requestService = new RequestService({
      // id: requestServiceCount + 1,
      user: req.body.user,
      service: req.body.service,
      garage: req.body.garage,
      car: req.body.car,
      images: req.body.images,
      addressUser: req.body.addressUser,
      geoLocationUser: req.body.geoLocationUser,
      geoLocationGarage: req.body.geoLocationGarage,
      problemDesc: req.body.problemDesc,
      confirmRequest: req.body.confirmRequest,
      status: req.body.status,
    });
    await requestService
      .save()
      .then((requestService) => {
        requestService.populate([
          "user",
          {
            path: "service",
            populate: [
              {
                path: "garage",
              },
              {
                path: "serviceType",
              },
            ],
          },
        ]).execPopulate()
        res.status(200).send({
          message: "Add request service successfully.",
          requestService
        });
      })
      .catch((err) => console.log(err));
  }
  //res.json(requestService)
  // });

  // res.json({id:RequestService.find().count()+1,...req.body})
};

module.exports.editRequestService = (req, res) => {
  const id = new ObjectId(req.params.id);
  if (typeof req.body == undefined || id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    RequestService.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        user: req.body.user,
        service: req.body.service,
        garage: req.body.garage,
        car: req.body.car,
        images: req.body.images,
        addressUser: req.body.addressUser,
        geoLocationUser: req.body.geoLocationUser,
        geoLocationGarage: req.body.geoLocationGarage,
        problemDesc: req.body.problemDesc,
        confirmRequest: req.body.confirmRequest,
        status: req.body.status,
      },
      {
        new: true,
      }
    )
      .then((requestService) => {
        if (!requestService) {
          return res.status(404).send({
            message: "RequestService not found with id " + id,
          });
        }
        res.status(200).send(requestService);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "RequestService not found with id " + id,
          });
        }
        return res.status(500).send({
          message: "Error updating RequestService with id " + id,
        });
      });
  }
};

module.exports.deleteRequestService = (req, res) => {
  const id = new ObjectId(req.params.id);
  if (id == null) {
    res.json({
      status: "error",
      message: "requestService id should be provided",
    });
  } else {
    RequestService.findByIdAndRemove({
      _id: id,
    })
      .then((requestService) => {
        if (!requestService) {
          return res.status(404).send({
            message: "RequestService not found with id " + id,
          });
        }
        res.status(200).send({
          message: "RequestService deleted successfully!",
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "RequestService not found with id " + id,
          });
        }
        return res.status(500).send({
          message: "Could not delete RequestService with id " + id,
        });
      });
  }
};

module.exports.getRequestServiceWithStatus = async (req, res) => {
  const garageId = req.params.id;
  const status = req.query.status;
  var servicesId = [];
  await Service.find({
    garage: garageId,
  })
    .populate([])
    .then((services) => {
      //res.json(services);
      console.log(services);

      services.forEach((service) => {
        servicesId.push(service._id);
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        // return res.status(404).send({
        //   message: "Service not found with id " + id,
        // });
        console.log(err);
      }
    });
  var query = {
    service: {
      $in: servicesId,
    },
  };

  if (status != null && status != "") {
    query = {
      service: {
        $in: servicesId,
      },
      status: status,
    };
  }

  await RequestService.find(query)
    .populate([
      "user",
      {
        path: "service",
        populate: [
          {
            path: "garage",
          },
          {
            path: "serviceType",
          },
        ],
      },
    ])
    .then((requestServices) => {
      res.status(200).json(requestServices);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(404).send({
          message: "RequestService not found with id " + id,
        });
      }
      res.status(500).send({
        message: "Error retrieving RequestService with id " + id,
      });
    });
};


module.exports.updateImageListRequestService = async (id, imageInput) => {
  console.log("imageInput: " + imageInput);
  const requestService = await RequestService.findOneAndUpdate(
    {
      id: id,
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
  return requestService;
};
