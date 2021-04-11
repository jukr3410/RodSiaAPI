const ServiceType = require('../models/serviceType.model');

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
        }).select(['-_id'])
        .then(serviceType => {
            res.json(serviceType)
        })
        .catch(err => console.log(err))
}



module.exports.addServiceType = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
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
                })
                serviceType.save()
                    .then(serviceType => res.json(serviceType))
                    .catch(err => console.log(err))

                res.json(serviceType)
            })

        //res.json({id:ServiceType.find().count()+1,...req.body})
    }
}

module.exports.editServiceType = (req, res) => {
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
            services: req.body.services,
            infoAssistants: req.body.infoAssistants
        })
    }
}

module.exports.deleteServiceType = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "service tpye id should be provided"
        })
    } else {
        ServiceType.findOne({id: req.params.id})
            .select(['-_id'])
            .then(serviceType => {
                res.json(serviceType)
            })
            .catch(err => console.log(err))
    }
}