const ServiceType = require('../models/serviceType.model')


module.exports.getAllServiceType = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    ServiceType.find().select(['-_id']).limit(limit).sort({
            id: sort
        })
        .then(serviceTypes => {
            res.json(serviceTypes)
        })
        .catch(err => console.log(err))
}

module.exports.getServiceType = (req, res) => {
    const id = req.params.id
    ServiceType.findOne({
            id
        })
        .then(serviceType => {
            res.json(serviceType)
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "ServiceType not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Error retrieving ServiceType with id " + id
            });
        });
}



module.exports.addServiceType = (req, res) => {
    if (req.body == undefined) {
        return res.status(400).send({
            message: "ServiceType content can not be empty"
        });
    } else {
        let serviceTypeCount = 0;
        ServiceType.find().countDocuments(function (err, count) {
                serviceTypeCount = count
            })
            .then(() => {
                const serviceType = new ServiceType({
                    id: serviceTypeCount + 1,
                    name: req.body.name,
                    description: req.body.description,
                    services: req.body.services,
                    infoAssistants: req.body.infoAssistants
                });
                serviceType.save()
                    .then(serviceType => res.json(serviceType))
                    .catch(err => console.log(err))
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the ServiceType."
                });

                res.json(serviceType)
            });

        // res.json({id:ServiceType.find().count()+1,...req.body})
    }
}

module.exports.editServiceType = (req, res) => {
    const id = req.params.id
    if (typeof req.body == undefined || id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        ServiceType.findOneAndUpdate({
                id
            }, {
                name: req.body.name,
                description: req.body.description,
                services: req.body.services,
                infoAssistants: req.body.infoAssistants
            }, {
                new: true
            })
            .then(serviceType => {
                if (!serviceType) {
                    return res.status(404).send({
                        message: "ServiceType not found with id " + id
                    });
                }
                res.send(serviceType);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "ServiceType not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Error updating ServiceType with id " + id
                });
            });

    }
}

module.exports.deleteServiceType = (req, res) => {
    const id = req.params.id
    if (id == null) {
        res.json({
            status: "error",
            message: "serviceType id should be provided"
        })
    } else {
        ServiceType.findOneAndRemove({
                id
            })
            .then(serviceType => {
                if (!serviceType) {
                    return res.status(404).send({
                        message: "ServiceType not found with id " + id
                    });
                }
                res.send({
                    message: "ServiceType deleted successfully!"
                });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "ServiceType not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Could not delete ServiceType with id " + id
                });
            });
    }
}