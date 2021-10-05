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
    .populate(["user", "service"])
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
    .populate([])
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

module.exports.addRequestService = (req, res) => {
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
      car: req.body.car,
      geoLocationUser: req.body.geoLocationUser,
      geoLocationGarage: req.body.geoLocationGarage,
      problemDesc: req.body.problemDesc,
      confirmRequest: req.body.confirmRequest,
      status: req.body.status,
    });
    requestService
      .save()
      .then((requestService) => {
        res.status(200).send({
          message: "Add request service successfully.",
          requestServiceId: requestService._id,
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
        car: req.body.car,
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

module.exports.getRequestServiceWaitingConfirm = (req, res) => {
  const id = new ObjectId(req.params.id);
  var serviceId;
  Service.find({
    garage: {
      $in: [id],
    },
  })
    .populate([])
    .then((service) => {
      //res.json(service);
      serviceId = new ObjectId(service[1]._id);
      console.log(service);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        // return res.status(404).send({
        //   message: "Service not found with id " + id,
        // });
        console.log(err);
      }
      // return res.status(500).send({
      //   message: "Error retrieving Service with id " + id,
      // });
    });

  RequestService.findOne({
    service: serviceId,
    status: "รอยืนยัน",
  })
    .populate([])
    .then((requestService) => {
      res.status(200).json(requestService);
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
