require("dotenv").config();
const Image = require("../models/image.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("../controllers/user.controller");
const Garage = require("../controllers/garage.controller");
const RequestService = require('../controllers/requestService.controller');



const AWS = require("aws-sdk");
const async = require("async");
const bucketName = "rodsiastorages";
const path = require("path");
const fs = require("fs");
let pathParams, image, imageName;

//AWS.config.loadFromPath("config.json");

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const createMainBucket = (callback) => {
  const bucketParams = {
    Bucket: bucketName,
  };
  s3.headBucket(bucketParams, function (err, data) {
    if (err) {
      console.log("ErrorHeadBucket", err);
      s3.createBucket(bucketParams, function (err, data) {
        if (err) {
          console.log("Error", err);
          callback(null, data);
        } else {
          callback(null, data);
        }
      });
    } else {
      callback(null, data);
    }
  });
};

const createItemObject = (callback) => {
  const params = {
    Bucket: bucketName,
    Key: `${imageName}`,
    ACL: "public-read",
    Body: image,
  };
  s3.putObject(params, function (err, data) {
    if (err) {
      console.log("Error uploading image: ", err);
      callback(err, null);
    } else {
      console.log("Successfully uploaded image on S3", data);
      callback(null, data);
    }
  });
};

module.exports.uploadProfileImageUserwithPhone = async (req, res, next) => {
  //var tmp_path = req.files.file.path;

  const phone = req.params.phone;

  console.log("file", req.files.file);
  var tmp_path = req.files.file.path;
  var imageS3 = await fs.createReadStream(tmp_path);
  //imageName = "restaurants/" + req.files.file.name; // ex. set name such as use id-date.(png/jpg)
  const pathImg = "users/" + phone + "/";
  const parts = req.files.file.name.split(".");
  const extension = parts[parts.length - 1];
  //imageName = pathImg + req.params.id + '-' + Date.now();
  var imageNameS3 = pathImg + Date.now();

  if (extension === "png" || extension === "jpeg" || extension === "jpg") {
    imageNameS3 += "." + extension;
  }
  const params = {
    Bucket: bucketName,
    Key: `${imageNameS3}`,
    ACL: "public-read",
    Body: imageS3,
  };
  await s3.putObject(params, function (err, imageS3) {
    if (err) {
      console.log("Error uploading image: ", err);
    } else {
      console.log("Successfully uploaded image on S3", imageS3);

      const image = new Image({
        _id: new mongoose.Types.ObjectId(),
        //name: req.params.id + '-' + Date.now(),
        name: imageNameS3,
        imageLink: process.env.S3_FILE_URL + imageNameS3,
      });
      image
        .save()
        .then(async (image) => {
          console.log("Image _id : " + image._id);
          console.log("phone: " + phone);

          const user = await User.updateProfileImageUser(phone, image.imageLink);
          console.log("result: " + user);

          res.status(200).json({
            message: "Successfully  uploaded",
            user,
          });
        })
        .catch((err) => console.log(err));
    }
  });
};

module.exports.uploadProfileImageGaragewithPhone = async (req, res, next) => {
	//var tmp_path = req.files.file.path;
  
	const phone = req.params.phone;
  
	console.log("file", req.files.file);
	var tmp_path = req.files.file.path;
	var imageS3 = await fs.createReadStream(tmp_path);
	//imageName = "restaurants/" + req.files.file.name; // ex. set name such as use id-date.(png/jpg)
	const pathImg = "garages/" + phone + "/";
	const parts = req.files.file.name.split(".");
	const extension = parts[parts.length - 1];
	//imageName = pathImg + req.params.id + '-' + Date.now();
	var imageNameS3 = pathImg + Date.now();
  
	if (extension === "png" || extension === "jpeg" || extension === "jpg") {
	  imageNameS3 += "." + extension;
	}
	const params = {
	  Bucket: bucketName,
	  Key: `${imageNameS3}`,
	  ACL: "public-read",
	  Body: imageS3,
	};
	await s3.putObject(params, function (err, imageS3) {
	  if (err) {
		console.log("Error uploading image: ", err);
	  } else {
		console.log("Successfully uploaded image on S3", imageS3);
  
		const image = new Image({
		  _id: new mongoose.Types.ObjectId(),
		  //name: req.params.id + '-' + Date.now(),
		  name: imageNameS3,
		  imageLink: process.env.S3_FILE_URL + imageNameS3,
		});
		image
		  .save()
		  .then( async (image) => {
			console.log("Image _id : " + image._id);
			console.log("phone: " + phone);
  
			const garage = await Garage.updateProfileImageGarage(phone, image.imageLink);
			console.log("result: " + garage);
  
			res.json({
			  message: "Successfully  uploaded",
			  garage,
			});
		  })
		  .catch((err) => console.log(err));
	  }
	});
};

module.exports.uploadGarageImageMultiple = async (req, res, next) => {
  //var tmp_path = req.files.file.path;

	const phone = req.params.phone;
  var number = req.params.index;

  console.log("index:" + number);

  console.log("file", req.files.file);
  var tmp_path = req.files.file.path;
  var imageS3 = await fs.createReadStream(tmp_path);

  //imageName = "restaurants/" + req.files.file.name; // ex. set name such as use id-date.(png/jpg)
  const pathImg = "garages/" + phone + "/images/";
  const parts = req.files.file.name.split(".");
  const extension = parts[parts.length - 1];
  //imageName = pathImg + req.params.id + '-' + Date.now();
  var imageNameS3 = pathImg + Date.now() + number;

  if (extension === "png" || extension === "jpeg" || extension === "jpg") {
    imageNameS3 += "." + extension;
  }

  const params = {
    Bucket: bucketName,
    Key: `${imageNameS3}`,
    ACL: "public-read",
    Body: imageS3,
  };
  await s3.putObject(params, function (err, imageS3) {
    if (err) {
      console.log("Error uploading image: ", err);
    } else {
      console.log("Successfully uploaded image on S3", imageS3);

      const imageMongo = new Image({
        _id: new mongoose.Types.ObjectId(),
        //name: req.params.id + '-' + Date.now(),
        name: imageNameS3,
        imageLink: process.env.S3_FILE_URL + imageNameS3,
      });
      imageMongo
        .save()
        .then( async (image) => {
          console.log("Image _id : " + image._id);
          console.log("phone: " + phone);

          const garage = await Garage.updateImageListGarage(phone, image.imageLink);

          res.json({
            message: "Successfully  uploaded",
            garage,
          });
        })
        .catch((err) => console.log(err));
    }
  });
};

module.exports.uploadRequestServiceImageMultiple = async (req, res, next) => {
  //var tmp_path = req.files.file.path;

	const id = req.params.id;
  var number = req.params.index;

  console.log("index:" + number);

  console.log("file", req.files.file);
  var tmp_path = req.files.file.path;
  var imageS3 = await fs.createReadStream(tmp_path);

  //imageName = "restaurants/" + req.files.file.name; // ex. set name such as use id-date.(png/jpg)
  const pathImg = "requestservices/" + id + "/images/";
  const parts = req.files.file.name.split(".");
  const extension = parts[parts.length - 1];
  //imageName = pathImg + req.params.id + '-' + Date.now();
  var imageNameS3 = pathImg + Date.now() + number;

  if (extension === "png" || extension === "jpeg" || extension === "jpg") {
    imageNameS3 += "." + extension;
  }

  const params = {
    Bucket: bucketName,
    Key: `${imageNameS3}`,
    ACL: "public-read",
    Body: imageS3,
  };
  await s3.putObject(params, function (err, imageS3) {
    if (err) {
      console.log("Error uploading image: ", err);
    } else {
      console.log("Successfully uploaded image on S3", imageS3);

      const imageMongo = new Image({
        _id: new mongoose.Types.ObjectId(),
        //name: req.params.id + '-' + Date.now(),
        name: imageNameS3,
        imageLink: process.env.S3_FILE_URL + imageNameS3,
      });
      imageMongo
        .save()
        .then( async (image) => {
          console.log("Image _id : " + image._id);
          console.log("id: " + id);

          const requestService = await RequestService.updateImageListRequestService(id, image.imageLink);

          res.json({
            message: "Successfully  uploaded",
            RequestService,
          });
        })
        .catch((err) => console.log(err));
    }
  });
};

module.exports.uploadByGarage = (req, res, next) => {
  var tmp_path = req.files.file.path;

  console.log("item", req.files.file);
  //var tmp_path = req.files.file.path;
  image = fs.createReadStream(tmp_path);
  //imageName = "garages/" + req.files.file.name; // ex. set name such as use id-date.(png/jpg)
  const pathImg = "garages/";
  const parts = req.files.file.name.split(".");
  const extension = parts[parts.length - 1];
  imageName = pathImg + req.params.id + "-" + Date.now();
  if (extension === "png" || extension === "jpeg" || extension === "jpg")
    imageName += "." + extension;

  console.log("image url: " + process.env.S3_FILE_URL + imageName);
  async.series([createMainBucket, createItemObject], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      const fileUpload = new Image({
        _id: new mongoose.Types.ObjectId(),
        fileName: req.params.id + "-" + Date.now(),
        fileLink: process.env.S3_FILE_URL + imageName,
        garage: req.params.id,
      });
      fileUpload.save().catch((err) => console.log(err));
      return res.json({
        message: "Successfully  uploaded",
        fileUpload,
      });
    }
  });
};

module.exports.uploadByInfoAssistant = (req, res, next) => {
  var tmp_path = req.files.file.path;
  // console.log("item", req.files.file)
  //var tmp_path = req.files.file.path;
  image = fs.createReadStream(tmp_path);
  const pathImg = "info-assistants/";
  const parts = req.files.file.name.split(".");
  const extension = parts[parts.length - 1];
  imageName = pathImg + req.params.id + "-" + Date.now();
  if (extension === "png" || extension === "jpeg" || extension === "jpg")
    imageName += "." + extension;
  async.series([createMainBucket, createItemObject], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      const fileUpload = new Image({
        fileName: req.params.id + "-" + Date.now(),
        fileLink: process.env.S3_FILE_URL + imageName,
        garage: req.params.id,
      });
      fileUpload.save().catch((err) => console.log(err));
      return res.json({
        message: "Successfully  uploaded",
        fileUpload,
      });
    }
  });
};

module.exports.displayForm = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.write(
    '<form action="/api/garages/60740615ef1ee83b90af3b77/file-uploads" method="post" enctype="multipart/form-data">' +
      '<input type="file" name="file">' +
      '<input type="submit" value="Upload">' +
      "</form>"
  );
  res.end();
};

module.exports.getAllGarageFiles = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Image.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((fileUploads) => {
      res.json(fileUploads);
    })
    .catch((err) => console.log(err));
};

module.exports.getByGarageId = (req, res) => {
  if (req.params.id == null) {
    req.json({
      status: "error",
      message: "Garage id should be provided",
    });
  } else {
    const query = {
      garage: {
        $in: [req.params.id],
      },
    };
    Image.find(query)
      .then((images) => {
        res.json(images);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

module.exports.getByInfoId = (req, res) => {
  if (req.params.id == null) {
    req.json({
      status: "error",
      message: "Info Assist id should be provided",
    });
  } else {
    const query = {
      infoAssistant: {
        $in: [req.params.id],
      },
    };
    Image.find(query)
      .then((images) => {
        res.json(images);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
