const Review = require("../models/review.model");
const ObjectId = require("mongodb").ObjectID;

module.exports.getAllReview = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Review.find()
    .select([])
    .limit(limit)
    .sort({
      _id: sort,
    })
    .populate([, "user", "garage"])
    .then((reviews) => {
      res.json(reviews);
    })
    .catch((err) => console.log(err));
};

module.exports.getReview = (req, res) => {
  const id = new ObjectId(req.params.id);
  Review.findById({
    _id: id,
  })
    .then((review) => {
      res.json(review);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Review not found with id " + id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Review with id " + id,
      });
    });
};

module.exports.addReview = (req, res) => {
  if (req.body == undefined) {
    return res.status(400).send({
      message: "Review content can not be empty",
    });
  } else {
    // let reviewCount = 0;
    // Review.find().countDocuments(function (err, count) {
    //         reviewCount = count
    //     })
    //     .then(() => {
    const review = new Review({
      // id: reviewCount + 1,
      //service: req.body.service,
      text: req.body.text,
      star: req.body.star,
      user: req.body.user,
      garage: req.body.garage,
    });
    review
      .save()
      .then((review) => {
        res.status(201).json(review);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });

    // res.json({id:Review.find().count()+1,...req.body})
  }
};

module.exports.editReview = (req, res) => {
  const id = new ObjectId(req.params.id);
  if (typeof req.body == undefined || id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    Review.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        //service: req.body.service,
        text: req.body.text,
        star: req.body.star,
        user: req.body.user,
        garage: req.body.garage,
      },
      {
        new: true,
      }
    )
      .then((review) => {
        if (!review) {
          return res.status(404).send({
            message: "Review not found with id " + id,
          });
        }
        res.status(200).send(review);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Review not found with id " + id,
          });
        }
        return res.status(500).send({
          message: "Error updating Review with id " + id,
        });
      });
  }
};

module.exports.deleteReview = (req, res) => {
  const id = new ObjectId(req.params.id);
  if (id == null) {
    res.json({
      status: "error",
      message: "review id should be provided",
    });
  } else {
    Review.findByIdAndRemove({
      _id: id,
    })
      .then((review) => {
        if (!review) {
          return res.status(404).send({
            message: "Review not found with id " + id,
          });
        }
        res.status(200).send({
          message: "Review deleted successfully!",
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "Review not found with id " + id,
          });
        }
        return res.status(500).send({
          message: "Could not delete Review with id " + id,
        });
      });
  }
};

module.exports.getReviewsByGarage = (req, res) => {
  const id = new ObjectId(req.params.id);

  if (id == null) {
    req.json({
      status: "error",
      message: "Garage id should be provided",
    });
  } else {
    const query = {
      garage: {
        $in: [id],
      },
    };
    Service.find(query)
      .populate(["user"])
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
