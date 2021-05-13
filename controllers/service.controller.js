const Service = require('../models/service.model')
const ObjectId = require('mongodb').ObjectID


module.exports.getAllService = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    Service.find().select(['-_id']).limit(limit).sort({
            _id: sort
        }).populate(["images","serviceTypes"])
        .then(services => {
            res.json(services)
        })
        .catch(err => console.log(err))
}

module.exports.getService = (req, res) => {
    const id = new ObjectId(req.params.id)
    Service.findById({
            "_id": id
        }).populate(["images","serviceTypes"])
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
        // let serviceCount = 0;
        // Service.find().countDocuments(function (err, count) {
        //         serviceCount = count
        //     })
        //     .then(() => {
        const service = new Service({
            // id: serviceCount + 1,
            name: req.body.name,
            description: req.body.description,
            serviceTypes: req.body.serviceType,
            garage: req.body.garage,
            images: req.body.images
        });
        service.save()
            // .then(service => res.json(service))
            .catch(err => console.log(err))
        res.status(200).send({
            message: "Add service successfully."
        });
        res.json(service)
        // });
        // res.json({id:Service.find().count()+1,...req.body})
    }
}

module.exports.editService = (req, res) => {
    const id = new ObjectId(req.params.id)
    if (typeof req.body == undefined || id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        Service.findByIdAndUpdate({
                "_id": id
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
    const id = new ObjectId(req.params.id)
    if (id == null) {
        res.json({
            status: "error",
            message: "service id should be provided"
        })
    } else {
        Service.findByIdAndRemove({
                "_id": id
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
    const id = new ObjectId(req.params.id)

    if (id == null) {
        req.json({
            status: "error",
            message: "ServiceType id should be provided"
        })
    } else {
        const query = {
            serviceTypes: {
                "$in": [id]
            }
        };
        Service.find(query).populate(["images","serviceTypes"])
            .then(services => {
                res.json(services)
            })
            .catch(err => {
                console.log(err);
            });
    }
};
module.exports.getByServiceName = (req, res) => {
    const name = req.params.name
    if (name == null) {
        req.json({
            status: "error",
            message: "Service name should be provided"
        })
    } else {
        const query = {
            name: {
                // "$regex": new RegExp(name, "i")
                "$regex": name,
                $options: 'i'
            }
        };

        Service.find(query).populate(["images","serviceTypes"])
            .then(service => {
                res.json(service)
            })
            .catch(err => {
                console.log(err);
            });
    }
};