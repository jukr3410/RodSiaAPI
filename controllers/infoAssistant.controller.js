const InfoAssistant = require('../models/infoAssistant.model')


module.exports.getAllInfoAssistant = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    InfoAssistant.find().select(['-_id']).limit(limit).sort({
            _id: sort
        }).populate(["serviceType","images"])
        .then(infoAssistants => {
            res.json(infoAssistants)
        })
        .catch(err => console.log(err))
}

module.exports.getInfoAssistant = (req, res) => {
    const id = new ObjectId(req.params.id)
    InfoAssistant.findById({
            "_id": id
        }).populate(["serviceType","images"])
        .then(infoAssistant => {
            res.json(infoAssistant)
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "InfoAssistant not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Error retrieving InfoAssistant with id" + id
            });
        });
}



module.exports.addInfoAssistant = (req, res) => {
    if (req.body == undefined) {
        return res.status(400).send({
            message: "InfoAssistant content can not be empty"
        });
    } else {
        // let infoAssistantCount = 0;
        // InfoAssistant.find().countDocuments(function (err, count) {
        //         infoAssistantCount = count
        //     })
        //     .then(() => {
        const infoAssistant = new InfoAssistant({
            // id: infoAssistantCount + 1,
            serviceType: req.body.serviceType,
            problemObserve: req.body.problemObserve,
            desc: req.body.desc,
            images: req.body.images
        });
        infoAssistant.save()
            // .then(serviceType => res.json(serviceType))
            .catch(err => console.log(err))
        res.status(200).send({
            message: "Add infomation assistant successfully."
        });

        res.json(infoAssistant)
        // });

        // res.json({id:InfoAssistant.find().count()+1,...req.body})
    }
}

module.exports.editInfoAssistant = (req, res) => {
    const id = new ObjectId(req.params.id)
    if (typeof req.body == undefined || id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        InfoAssistant.findByIdAndUpdate({
                "_id": id
            }, {
                serviceType: req.body.serviceType,
                problemObserve: req.body.problemObserve,
                desc: req.body.desc,
                images: req.body.images
            }, {
                new: true
            })
            .then(infoAssistant => {
                if (!infoAssistant) {
                    return res.status(404).send({
                        message: "InfoAssistant not found with id " + id
                    });
                }
                res.send(infoAssistant);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "InfoAssistant not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Error updating InfoAssistant with id " + id
                });
            });
    }
}

module.exports.deleteInfoAssistant = (req, res) => {
    const id = new ObjectId(req.params.id)
    if (id == null) {
        res.json({
            status: "error",
            message: "infoAssistant id should be provided"
        })
    } else {
        InfoAssistant.findByIdAndRemove({
                "_id": id
            })
            .then(infoAssistant => {
                if (!infoAssistant) {
                    return res.status(404).send({
                        message: "InfoAssistant not found with id " + id
                    });
                }
                res.send({
                    message: "InfoAssistant deleted successfully!"
                });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "InfoAssistant not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Could not delete InfoAssistant with id " + id
                });
            });
    }
}