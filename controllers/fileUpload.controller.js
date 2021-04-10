const FileUpload = require('../models/fileUpload.model');

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
        }).select(['-_id'])
        .then(fileUpload => {
            res.json(fileUpload)
        })
        .catch(err => console.log(err))
}



module.exports.addFileUpload = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
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

                res.json(fileUpload)
            });

        // res.json({id:FileUpload.find().count()+1,...req.body})
    }
}

module.exports.editFileUpload = (req, res) => {
    if (typeof req.body == undefined || req.params.id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        res.json({
            id: req.body.id,
            fileName: req.body.fileName,
            filePath: req.body.filePath,
            service: req.body.service,
            garage: req.body.garage,
            infoAssistant: req.body.infoAssistant
        })
    }
}

module.exports.deleteFileUpload = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "fileUpload id should be provided"
        })
    } else {
        FileUpload.findOne({
                id: req.params.id
            })
            .select(['-_id'])
            .then(fileUpload => {
                res.json(fileUpload)
            })
            .catch(err => console.log(err))
    }
}