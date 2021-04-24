const User = require('../models/user.model')
const mongoose = require('mongoose')
const UsersDto = require("../dtos/responses/users.dto");
const AppResponseDto = require("../dtos/responses/app_response.dto");
const session = require('express-session')
const Garage = require('../models/garage.model')


const isEmpty = function (obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};
module.exports.registerUser = (req, res) => {

    const errors = {};
    const name = req.body.name
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password
    const validatePhone = req.body.validatePhone
    const brand = req.body.cars.brand
    const model = req.body.cars.model
    const type = req.body.cars.type
    const year = req.body.cars.year
    const review = req.body.review
    const requestServices = req.body.requestServices
    return User.findOne({
        $or: [{
                phone
            },
            {
                email
            }
        ]
    }).then((user) => {
        if (user !== null) {
            if (user.phone === phone)
                errors.phone = 'username: ' + phone + ' is already taken';
            if (user.email === email)
                errors.email = 'Email: ' + email + ' is already taken';
            if (!isEmpty(errors)) {
                // return res.status(422).json({success: false, errors});
                return res.status(422).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        } else {
            user = new User({
                name: name,
                email: email,
                phone: phone,
                password: password,
                validatePhone: validatePhone,
                cars: [{
                    brand: brand,
                    model: model,
                    type: type,
                    year: year
                }],
                review: review,
                requestServices: requestServices
            });
            user.save().then(user => {
                if (user) {
                    console.dir(user);
                    console.log(user.toJSON());
                    res.send(UsersDto.registerDto(user));
                } else {
                    console.log('user is empty ...???');
                    res.json(AppResponseDto.buildWithErrorMessages('something went wrong'));
                }
            }).catch(err => {
                throw err
            });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({
            success: false,
            full_messages: err
        });
    });
}

module.exports.registerGarage = (req, res) => {
    const errors = {};
    const phone = req.body.phone
    const email = req.body.email
    if (req.body == undefined) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }
    return Garage.findOne({
        $or: [{
                'phone': phone
            },
            {
                'email': email
            }
        ]
    }).then(garage => {
        if (garage !== null) {
            if (garage.phone === phone)
                errors.phone = 'Phone: ' + phone + ' is already taken';
            if (garage.email === email)
                errors.email = 'Email: ' + email + ' is already taken';
            if (!isEmpty(errors)) {
                // return res.status(422).json({success: false, errors});
                return res.status(422).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        } else {
            garage = new Garage({
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
                .then(garage => {
                    if (garage) {
                        console.dir(garage);
                        console.log(garage.toJSON());
                        res.json(UsersDto.registerDto(garage));
                    } else {
                        console.log('user is empty ...???');
                        res.json(AppResponseDto.buildWithErrorMessages('something went wrong'));
                    }
                }).catch(err => {
                    throw err
                });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({
            success: false,
            full_messages: err
        });
    });
}

module.exports.loginUser = async (req, res) => {
    try {
        const phone = req.body.phone
        const password = req.body.password
        const user = await User.findOne({
            phone
        });
        if (!user) {
            res.status(404).send({
                message: "User not found with that " + phone
            });
        } else {
            let encrypt = await User.isValidPassword(password, user.password);
            if (encrypt == true) {
                session.loginUser = true
                session.phone = phone
                res.status(200).json({
                    message: "Login Success",
                    user
                });
                console.dir(user);
                console.log(user.toJSON());
            } else {
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }
    } catch (err) {
        throw err;
    }
}


module.exports.loginGarage = async (req, res) => {
    try {
        const phone = req.body.phone
        const password = req.body.password
        const garage = await Garage.findOne({
            phone
        });
        if (!garage) {
            res.status(404).send({
                message: "User not found with that " + phone
            });
        } else {
            let encrypt = await Garage.isValidPassword(password, garage.password);
            if (encrypt == true) {
                session.loginGarage = true
                session.phone = phone
                res.status(200).json({
                    message: "Login Success",
                    garage
                });
                console.dir(user);
                console.log(user.toJSON());
            } else {
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }
    } catch (err) {
        if (err) throw err;
    }
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