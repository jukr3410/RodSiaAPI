const ServiceType = require('../models/serviceType.model')
const ObjectId = require('mongodb').ObjectID



module.exports.getAllServiceType = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    ServiceType.find().select([]).limit(limit).sort({
            _id: sort
        })
        .then(serviceTypes => {
            res.json(serviceTypes)
        })
        .catch(err => console.log(err))
}

module.exports.getServiceType = (req, res) => {
    const id = new ObjectId(req.params.id)
    User.findById({
            "_id": id
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
        // let serviceTypeCount = 0;
        // ServiceType.find().countDocuments(function (err, count) {
        //         serviceTypeCount = count
        //     })
        //     .then(() => {
        const serviceType = new ServiceType({
            // id: serviceTypeCount + 1,
            name: req.body.name,
            description: req.body.description,
        });
        serviceType.save()
            // .then(serviceType => res.json(serviceType))
            .catch(err => console.log(err))
        res.status(201).send({
            message: "Add serviceType successfully."
        });
        res.json(serviceType)
        // });
        // res.json({id:ServiceType.find().count()+1,...req.body})
    }
}

module.exports.editServiceType = (req, res) => {
    const id = new ObjectId(req.params.id)
    if (typeof req.body == undefined || id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        ServiceType.findByIdAndUpdate({
                "_id": id
            }, {
                name: req.body.name,
                description: req.body.description,
            }, {
                new: true
            })
            .then(serviceType => {
                if (!serviceType) {
                    return res.status(404).send({
                        message: "ServiceType not found with id " + id
                    });
                }
                res.status(200).send(serviceType);
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
    const id = new ObjectId(req.params.id)
    if (id == null) {
        res.json({
            status: "error",
            message: "serviceType id should be provided"
        })
    } else {
        ServiceType.findByIdAndRemove({
                "_id": id
            })
            .then(serviceType => {
                if (!serviceType) {
                    return res.status(404).send({
                        message: "ServiceType not found with id " + id
                    });
                }
                res.status(200).send({
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