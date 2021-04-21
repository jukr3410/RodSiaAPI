const FileUpload = require('../models/fileUpload.model');

const AWS = require("aws-sdk");
const async = require("async");
const bucketName = "rodsiastorages";
const path = require("path");
const fs = require("fs");
let pathParams, image, imageName;

AWS.config.loadFromPath("config.json");

const s3 = new AWS.S3({
	region: 'ap-southeast-1'
});
const createMainBucket = (callback) => {
	const bucketParams = {
		Bucket: bucketName
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

module.exports.uploadByGarage = (req, res, next) => {
	var tmp_path = req.files.file.path;
	// console.log("item", req.files.file)
	//var tmp_path = req.files.file.path;
	image = fs.createReadStream(tmp_path);
	imageName = "garages/" + req.files.file.name; // ex. set name such as use id-date.(png/jpg)
	async.series([createMainBucket, createItemObject], (err, result) => {
		if (err) {
			return res.send(err);
		} else {
			const fileUpload = new FileUpload({
				fileName: req.files.file.name,
				fileLink: process.env.S3_FILE_URL+imageName,
				garage: req.params.id
			});
			fileUpload.save()
				.catch(err => console.log(err));
			return res.json({
				message: "Successfully  uploaded",
				fileUpload
			});
		}
	});
};


module.exports.uploadByInfoAssistant = (req, res, next) => {
	var tmp_path = req.files.file.path;
	// console.log("item", req.files.file)
	//var tmp_path = req.files.file.path;
	image = fs.createReadStream(tmp_path);
	imageName = "info-assistants/" + req.files.file.name; // ex. set name such as use id-date.(png/jpg)
	async.series([createMainBucket, createItemObject], (err, result) => {
		if (err) {
			return res.send(err);
		} else {
			const fileUpload = new FileUpload({
				fileName: req.files.file.name,
				fileLink: process.env.S3_FILE_URL+imageName,
				garage: req.params.id
			});
			fileUpload.save()
				.catch(err => console.log(err));
			return res.json({
				message: "Successfully  uploaded",
				fileUpload
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
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    FileUpload.find().select(['-_id']).limit(limit).sort({
            id: sort
        })
        .then(fileUploads => {
            res.json(fileUploads)
        })
        .catch(err => console.log(err))
}

module.exports.getByGarageId = (req, res) => {
    if (req.params.id == null) {
        req.json({
            status: "error",
            message: "Garage id should be provided"
        })
    } else {
        const query = {
            garage: {
                "$in": [req.params.id]
            }
        };
        FileUpload.find(query)
            .then(images => {
                res.json(images)
            })
            .catch(err => {
                console.log(err);
            });
    }
};


module.exports.getByInfoId = (req, res) => {
    if (req.params.id == null) {
        req.json({
            status: "error",
            message: "Info Assist id should be provided"
        })
    } else {
        const query = {
            infoAssistant: {
                "$in": [req.params.id]
            }
        };
        FileUpload.find(query)
            .then(images => {
                res.json(images)
            })
            .catch(err => {
                console.log(err);
            });
    }
};

// module.exports.getAllFileUpload = (req, res) => {
//     const limit = Number(req.query.limit) || 0
//     const sort = req.query.sort == "desc" ? -1 : 1

//     FileUpload.find().select(['-_id']).limit(limit).sort({
//             id: sort
//         })
//         .then(fileUploads => {
//             res.json(fileUploads)
//         })
//         .catch(err => console.log(err))
// }

// module.exports.getFileUpload = (req, res) => {
//     const id = req.params.id
//     FileUpload.findOne({
//             id
//         })
//         .then(fileUpload => {
//             res.json(fileUpload)
//         })
//         .catch(err => {
//             if (err.kind === 'ObjectId') {
//                 return res.status(404).send({
//                     message: "FileUpload not found with id " + id
//                 });
//             }
//             return res.status(500).send({
//                 message: "Error retrieving FileUpload with id " + id
//             });
//         });
// }



// module.exports.addFileUpload = (req, res) => {
//     if (req.body == undefined) {
//         return res.status(400).send({
//             message: "FileUpload content can not be empty"
//         });
//     } else {
//         let fileUploadCount = 0;
//         FileUpload.find().countDocuments(function (err, count) {
//                 fileUploadCount = count
//             })
//             .then(() => {
//                 const fileUpload = new FileUpload({
//                     id: fileUploadCount + 1,
//                     fileName: req.body.fileName,
//                     filePath: req.body.filePath,
//                     service: req.body.service,
//                     garage: req.body.garage,
//                     infoAssistant: req.body.infoAssistant
//                 });
//                 fileUpload.save()
//                     .then(fileUpload => res.json(fileUpload))
//                     .catch(err => console.log(err))
//                 res.status(500).send({
//                     message: err.message || "Some error occurred while creating the FileUpload."
//                 });

//                 res.json(fileUpload)
//             });

//         // res.json({id:FileUpload.find().count()+1,...req.body})
//     }
// }

// module.exports.editFileUpload = (req, res) => {
//     const id = req.params.id
//     if (typeof req.body == undefined || id == null) {
//         res.json({
//             status: "error",
//             message: "something went wrong! check your sent data"
//         })
//     } else {
//         FileUpload.findOneAndUpdate({
//                 id
//             }, {
//                 fileName: req.body.fileName,
//                 filePath: req.body.filePath,
//                 service: req.body.service,
//                 garage: req.body.garage,
//                 infoAssistant: req.body.infoAssistant
//             }, {
//                 new: true
//             })
//             .then(fileUpload => {
//                 if (!fileUpload) {
//                     return res.status(404).send({
//                         message: "FileUpload not found with id " + id
//                     });
//                 }
//                 res.send(fileUpload);
//             }).catch(err => {
//                 if (err.kind === 'ObjectId') {
//                     return res.status(404).send({
//                         message: "FileUpload not found with id " + id
//                     });
//                 }
//                 return res.status(500).send({
//                     message: "Error updating FileUpload with id " + id
//                 });
//             });

//     }
// }

// module.exports.deleteFileUpload = (req, res) => {
//     const id = req.params.id
//     if (id == null) {
//         res.json({
//             status: "error",
//             message: "fileUpload id should be provided"
//         })
//     } else {
//         FileUpload.findOneAndRemove({
//                 id
//             })
//             .then(fileUpload => {
//                 if (!fileUpload) {
//                     return res.status(404).send({
//                         message: "FileUpload not found with id " + id
//                     });
//                 }
//                 res.send({
//                     message: "FileUpload deleted successfully!"
//                 });
//             }).catch(err => {
//                 if (err.kind === 'ObjectId' || err.name === 'NotFound') {
//                     return res.status(404).send({
//                         message: "FileUpload not found with id " + id
//                     });
//                 }
//                 return res.status(500).send({
//                     message: "Could not delete FileUpload with id " + id
//                 });
//             });
//     }
// }