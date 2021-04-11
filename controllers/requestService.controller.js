const RequestService = require('../models/requestService.model');

module.exports.getAllRequestService = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    RequestService.find().select(['-_id']).limit(limit).sort({
            id: sort
        })
        .then(requestServices => {
            res.json(requestServices)
        })
        .catch(err => console.log(err))
}

module.exports.getRequestService = (req, res) => {
    const id = req.params.id

    RequestService.findOne({
            id
        }).select(['-_id'])
        .then(requestService => {
            res.json(requestService)
        })
        .catch(err => console.log(err))
}



module.exports.addRequestService = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
    } else {
        let requestServiceCount = 0;
        RequestService.find().countDocuments(function (err, count) {
                requestServiceCount = count
            })
            .then(() => {
                const requestService = new RequestService({
                    id: requestServiceCount + 1,
                    user: req.body.user,
                    service: req.body.service,
                    geolocation: req.body.geolocation,
                    problemDesc: req.body.problemDesc,
                    confirmRequest: req.body.confirmRequest,
                    date: req.body.date
                });
                requestService.save()
                    .then(requestService => res.json(requestService))
                    .catch(err => console.log(err))

                res.json(requestService)
            });

        // res.json({id:RequestService.find().count()+1,...req.body})
    }
}

module.exports.editRequestService = (req, res) => {
    if (typeof req.body == undefined || req.params.id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        res.json({
            id: req.body.id,
            user: req.body.user,
            service: req.body.service,
            geolocation: req.body.geolocation,
            problemDesc: req.body.problemDesc,
            confirmRequest: req.body.confirmRequest,
            date: req.body.date
        })
    }
}

module.exports.deleteRequestService = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "requestService id should be provided"
        })
    } else {
        RequestService.findOne({
                id: req.params.id
            })
            .select(['-_id'])
            .then(requestService => {
                res.json(requestService)
            })
            .catch(err => console.log(err))
    }
}