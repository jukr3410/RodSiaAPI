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

module.exports.getOneService = (req, res) => {
    const ReqId = req.params.id

    Service.findOne({
            id: ReqId
        }).then(service => {
            res.json(service)
        })
        .catch(err => console.log(err))
}
module.exports.getManyService = (req, res) => {
    const ReqName = req.params.name

    Service.findMany({
            name: /Reqname/
        })
        .then(service => {
            res.json(service)
        })
        .catch(err => console.log(err))
}


module.exports.addUser = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
    } else {

        let userCount = 0;
        User.find().countDocuments(function (err, count) {
                userCount = count
            })
            .then(() => {
                const user = new User({
                    id: userCount + 1,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    name: {
                        firstname: req.body.name.firstname,
                        lastname: req.body.name.lastname
                    },
                    address: {
                        city: req.body.address.city,
                        street: req.body.address.street,
                        number: req.body.address.number,
                        zipcode: req.body.address.zipcode,
                        geolocation: {
                            lat: req.body.address.geolocation.lat,
                            long: req.body.address.geolocation.long
                        }
                    },
                    phone: req.body.phone
                })
                user.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err))

                res.json(user)
            })




        //res.json({id:User.find().count()+1,...req.body})
    }
}

module.exports.editUser = (req, res) => {
    if (typeof req.body == undefined || req.params.id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        res.json({

            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            geolocation: {
                lat: req.body.geolocation.lat,
                long: req.body.geolocation.long
            },
            cars: [{
                brand: req.body.cars.brand,
                model: req.body.cars.model,
                type: req.body.cars.type,
                year: req.body.cars.year
            }]
        })
    }
}

module.exports.deleteUser = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "cart id should be provided"
        })
    } else {
        User.findOne({
                id: req.params.id
            })
            .select(['-_id'])
            .then(user => {
                res.json(user)
            })
            .catch(err => console.log(err))
    }
}