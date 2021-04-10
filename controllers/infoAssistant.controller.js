const InfoAssistant = require('../models/infoAssistant.model');

module.exports.getAllInfoAssistant = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    InfoAssistant.find().select(['-_id']).limit(limit).sort({
            id: sort
        })
        .then(infoAssistants => {
            res.json(infoAssistants)
        })
        .catch(err => console.log(err))
}

module.exports.getInfoAssistant = (req, res) => {
    const id = req.params.id

    InfoAssistant.findOne({
            id
        }).select(['-_id'])
        .then(infoAssistant => {
            res.json(infoAssistant)
        })
        .catch(err => console.log(err))
}



module.exports.addInfoAssistant = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
    } else {
        let infoAssistantCount = 0;
        InfoAssistant.find().countDocuments(function (err, count) {
                infoAssistantCount = count
            })
            .then(() => {
                const infoAssistant = new InfoAssistant({
                    id: infoAssistantCount + 1,
                    serviceType: req.body.serviceType,
                    problemObserve: req.body.problemObserve,
                    desc: req.body.desc,
                    images: req.body.images
                });
                infoAssistant.save()
                    .then(infoAssistant => res.json(infoAssistant))
                    .catch(err => console.log(err))

                res.json(infoAssistant)
            });

        // res.json({id:InfoAssistant.find().count()+1,...req.body})
    }
}

module.exports.editInfoAssistant = (req, res) => {
    if (typeof req.body == undefined || req.params.id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        res.json({
            id: req.body.id,
            serviceType: req.body.serviceType,
            problemObserve: req.body.problemObserve,
            desc: req.body.desc,
            images: req.body.images

        })
    }
}

module.exports.deleteInfoAssistant = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "infoAssistant id should be provided"
        })
    } else {
        InfoAssistant.findOne({
                id: req.params.id
            })
            .select(['-_id'])
            .then(infoAssistant => {
                res.json(infoAssistant)
            })
            .catch(err => console.log(err))
    }
}