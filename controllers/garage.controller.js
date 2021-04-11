const Garage = require('../models/garage.model')

module.exports.getAllGarage = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    Garage.find().select(['-_id']).limit(limit).sort({
            id: sort
        })
        .then(garages => {
            res.json(garages)
        })
        .catch(err => console.log(err))
}

module.exports.getGarage = (req, res) => {
    const id = req.params.id

    Garage.findOne({
            id
        }).select(['-_id'])
        .then(garage => {
            res.json(garage)
        })
        .catch(err => console.log(err))
}



module.exports.addGarage = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
    } else {
        let garageCount = 0;
        Garage.find().countDocuments(function (err, count) {
                garageCount = count
            })
            .then(() => {
                const garage = new Garage({
                    id: garageCount + 1,
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    validatePhone: req.body.validatePhone,
                    address: req.body.address,
                    images: req.body.images,
                    services: req.body.services,
                    reviews: req.body.reviews
                });
                garage.save()
                    .then(garage => res.json(garage))
                    .catch(err => console.log(err))

                res.json(garage)
            });

        // res.json({id:Garage.find().count()+1,...req.body})
    }
}

module.exports.editGarage = (req, res) => {
    if (typeof req.body == undefined || req.params.id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        res.json({
            id: req.body.id,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            validatePhone: req.body.validatePhone,
            address: req.body.address,
            images: req.body.images,
            services: req.body.services,
            reviews: req.body.reviews
        })
    }
}

module.exports.deleteGarage = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "garage id should be provided"
        })
    } else {
        Garage.findOne({
                id: req.params.id
            })
            .select(['-_id'])
            .then(garage => {
                res.json(garage)
            })
            .catch(err => console.log(err))
    }
}