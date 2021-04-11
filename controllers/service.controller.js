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
        }).select(['-_id'])
        .then(service => {
            res.json(service)
        })
        .catch(err => console.log(err))
}



module.exports.addService = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
    } else {
        let serviceCount = 0;
        Service.find().countDocuments(function (err, count) {
                serviceCount = count
            })
            .then(() => {
                const service = new Service({
                    id: serviceCount + 1,
                    name: req.body.name,
                    description: req.body.description,
                    serviceType: req.body.serviceType,
                    garage: req.body.garage,
                    images: req.body.images
                });
                service.save()
                    .then(service => res.json(service))
                    .catch(err => console.log(err))

                res.json(service)
            });

        // res.json({id:Service.find().count()+1,...req.body})
    }
}

module.exports.editService = (req, res) => {
    if (typeof req.body == undefined || req.params.id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        res.json({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            serviceType: req.body.serviceType,
            garage: req.body.garage,
            images: req.body.images
        })
    }
}

module.exports.deleteService = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "service id should be provided"
        })
    } else {
        Service.findOne({
                id: req.params.id
            })
            .select(['-_id'])
            .then(service => {
                res.json(service)
            })
            .catch(err => console.log(err))
    }
}