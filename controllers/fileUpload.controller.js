const FileUpload = require('../models/fileUpload.model')


module.exports.getAllFileUpload = (req, res) => {
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

module.exports.getFileUpload = (req, res) => {
    const id = req.params.id
    FileUpload.findOne({
            id
        })
        .then(fileUpload => {
            res.json(fileUpload)
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "FileUpload not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Error retrieving FileUpload with id " + id
            });
        });
}



module.exports.addFileUpload = (req, res) => {
    if (req.body == undefined) {
        return res.status(400).send({
            message: "FileUpload content can not be empty"
        });
    } else {
        let fileUploadCount = 0;
        FileUpload.find().countDocuments(function (err, count) {
                fileUploadCount = count
            })
            .then(() => {
                const fileUpload = new FileUpload({
                    id: fileUploadCount + 1,
                    fileName: req.body.fileName,
                    filePath: req.body.filePath,
                    service: req.body.service,
                    garage: req.body.garage,
                    infoAssistant: req.body.infoAssistant
                });
                fileUpload.save()
                    .then(fileUpload => res.json(fileUpload))
                    .catch(err => console.log(err))
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the FileUpload."
                });

                res.json(fileUpload)
            });

        // res.json({id:FileUpload.find().count()+1,...req.body})
    }
}

module.exports.editFileUpload = (req, res) => {
    const id = req.params.id
    if (typeof req.body == undefined || id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        FileUpload.findOneAndUpdate({
                id
            }, {
                fileName: req.body.fileName,
                filePath: req.body.filePath,
                service: req.body.service,
                garage: req.body.garage,
                infoAssistant: req.body.infoAssistant
            }, {
                new: true
            })
            .then(fileUpload => {
                if (!fileUpload) {
                    return res.status(404).send({
                        message: "FileUpload not found with id " + id
                    });
                }
                res.send(fileUpload);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "FileUpload not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Error updating FileUpload with id " + id
                });
            });

    }
}

module.exports.deleteFileUpload = (req, res) => {
    const id = req.params.id
    if (id == null) {
        res.json({
            status: "error",
            message: "fileUpload id should be provided"
        })
    } else {
        FileUpload.findOneAndRemove({
                id
            })
            .then(fileUpload => {
                if (!fileUpload) {
                    return res.status(404).send({
                        message: "FileUpload not found with id " + id
                    });
                }
                res.send({
                    message: "FileUpload deleted successfully!"
                });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "FileUpload not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Could not delete FileUpload with id " + id
                });
            });
    }
}