const User = require('../models/user.model')
const mongoose = require('mongoose')
// const model = mongoose.model
//const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const session = require('express-session')
const Garage = require('../models/garage.model')


module.exports.registerUser = (req, res) => {
    if (req.body == undefined) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }
    User.findOne({
        $or: [{
                phone: req.body.phone
            },
            {
                email: req.body.email
            }
        ]
    }).then((user) => {
        if (user) {
            res.send({
                message: "This user already. "
            })
        } else {
            // let userCount = 0;
            // User.find().countDocuments(function (err, count) {
            //         userCount = count
            //     })
            // .then(() => {
            const user = new User({
                // id: userCount + 1,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                validatePhone: req.body.validatePhone,
                cars: [{
                    brand: req.body.cars.brand,
                    model: req.body.cars.model,
                    type: req.body.cars.type,
                    year: req.body.cars.year
                }],
                review: req.body.review,
                requestServices: req.body.requestServices
            });
            user.save()
            session.loginUser = true
            session.phone = req.body.phone
                // .then(serviceType => res.json(serviceType))
                .catch(err => console.log(err))
            res.status(200).send({
                message: "register successfully."
            });
            res.json(user)
            // });
        }
    })
}
module.exports.registerGarage = (req, res) => {
    if (req.body == undefined) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }
    Garage.findOne({
        $or: [{
                phone: req.body.phone
            },
            {
                email: req.body.email
            }
        ]
    }).then((garage) => {
        if (garage) {
            res.send({
                message: "This garage already. "
            })
        } else {
            // let garageCount = 0;
            // Garage.find().countDocuments(function (err, count) {
            //         garageCount = count
            //     })
            //     .then(() => {
            const garage = new Garage({
                // id: garageCount + 1,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                validatePhone: req.body.validatePhone,
                address: {
                    addressDesc: req.body.address.addressDesc,
                    geolocation: {
                        lat: req.body.address.geolocation.lat,
                        long: req.body.address.geolocation.long
                    }
                },
                services: req.body.services,
                reviews: req.body.reviews
            });
            garage.save()
            session.loginGarage = true
            session.phone = req.body.phone
                // .then(serviceType => res.json(serviceType))
                .catch(err => console.log(err))
            res.status(200).send({
                message: "register successfully."
            });
            res.json(garage)
            // });
        }
    })
}

module.exports.loginUser = (req, res) => {
    const phone = req.body.phone
    const password = req.body.password
    User.findOne({
            phone
        })
        .then(user => {
            if (!user) res.status(404).send({
                message: "User not found with that " + phone
            });
            else {
                User.isValidPassword(password,user.password).catch(err => {
                    res.status(500).json(err)
                });
                // bcrypt.compare(password, user.password, (error => {
                //     if (error) res.status(500).json(error)
                //     res.end()
                // }))
                session.loginUser = true
                session.phone = phone
            }
            res.json(user)
        })
        .catch(err => {
            res.status(500).json(err)
        });
}

module.exports.loginGarage = (req, res) => {
    const phone = req.body.phone
    const password = req.body.password
    Garage.findOne({
            phone
        })
        .then(garage => {
            if (!garage) res.status(404).send({
                message: "User not found with that " + phone
            });
            else {
                User.isValidPassword(password).catch(err => {
                    res.status(500).json(err)
                });
                // bcrypt.compare(password, garage.password, (error => {
                //     if (error) res.status(500).json(error)
                //     res.end()

                // }))
                session.loginGarage = true
                session.phone = phone
            }
            res.json(garage)
        })

        .catch(err => {
            res.status(500).json(err)
        });
}


module.exports.logout = (req, res) => {
    if (session) {
        session.destroy(() => {
            req.logout();
        });
    }
}

module.exports.getSession = (req, res) => {
    console.log(sess)
    if (!session) {
        res.send({
            message: "Do not have session."
        })
    } else {
        res.status(200).send('Phone = ' + session.phone)
    }
}