const Service = require('../models/service.model')


module.exports.getAllService = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    Service.find().select(['-_id']).limit(limit).sort({
            id: sort
        })
        .then(services => {
            res.json(services)
        })
        .catch(err => console.log(err))
}

module.exports.getService = (req, res) => {
    const id = req.params.id
    Service.findOne({
            id
        })
        .then(service => {
            res.json(service)
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Service not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Error retrieving Service with id " + id
            });
        });
}



module.exports.addService = (req, res) => {
    if (req.body == undefined) {
        return res.status(400).send({
            message: "Service content can not be empty"
        });
    } else {
        let serviceCount = 0;
        Service.find().countDocuments(function (err, count) {
                serviceCount = count
            })
            .then(() => {
                const service = new Service({
                    id: serviceCount + 1,
                    serviceType: req.body.serviceType,
                    problemObserve: req.body.problemObserve,
                    desc: req.body.desc,
                    images: req.body.images
                });
                service.save()
                    .then(service => res.json(service))
                    .catch(err => console.log(err))
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Service."
                });

                res.json(service)
            });

        // res.json({id:Service.find().count()+1,...req.body})
    }
}

module.exports.editService = (req, res) => {
    const id = req.params.id
    if (typeof req.body == undefined || id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        Service.findOneAndUpdate({
                id
            }, {
                serviceType: req.body.serviceType,
                problemObserve: req.body.problemObserve,
                desc: req.body.desc,
                images: req.body.images
            }, {
                new: true
            })
            .then(service => {
                if (!service) {
                    return res.status(404).send({
                        message: "Service not found with id " + id
                    });
                }
                res.send(service);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Service not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Error updating Service with id " + id
                });
            });

    }
}

module.exports.deleteService = (req, res) => {
    const id = req.params.id
    if (id == null) {
        res.json({
            status: "error",
            message: "service id should be provided"
        })
    } else {
        Service.findOneAndRemove({
                id
            })
            .then(service => {
                if (!service) {
                    return res.status(404).send({
                        message: "Service not found with id " + id
                    });
                }
                res.send({
                    message: "Service deleted successfully!"
                });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "Service not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Could not delete Service with id " + id
                });
            });
    }
}


module.exports.getByServiceType = (req, res) => {
    if (req.params.id == null) {
        req.json({
            status: "error",
            message: "ServiceType id should be provided"
        })
    } else {
        const query = {
            serviceTypes: {
                "$in": [req.params.id]
            }
        };
        Service.find(query)
            .then(services => {
                res.json(services)
            })
            .catch(err => {
                console.log(err);
            });
    }
};