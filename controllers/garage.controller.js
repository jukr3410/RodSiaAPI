const Garage = require('../models/garage.model')

const FileUpload = require('../models/fileUpload.model');


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
        })
        .then(garage => {
            res.json(garage)
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Garage not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Error retrieving Garage with id " + id
            });
        });
}



module.exports.addGarage = (req, res) => {
    if (req.body == undefined) {
        return res.status(400).send({
            message: "Garage content can not be empty"
        });
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
                    services: req.body.services,
                    reviews: req.body.reviews
                });

                const images = req.files;

                for (let i = 0; i < images.length; i++){
                    let file = images[i];
                    let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                    filePath = filePath.replace('public', '');
                    let fileUpload = new FileUpload({
                        fileName = file.fileName,
                        filePath = filePath,

                    });

                    fileUpload.garage = garage;
                    garage.images.push(fileUpload);
                    fileUpload.save();
                }

               

                garage.save()
                    .then(garage => res.json(garage))
                    .catch(err => console.log(err))
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Garage."
                });

                res.json(garage)
            });

        // res.json({id:Garage.find().count()+1,...req.body})
    }
}

module.exports.editGarage = (req, res) => {
    const id = req.params.id
    if (typeof req.body == undefined || id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        Garage.findOneAndUpdate({
                id
            }, {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                validatePhone: req.body.validatePhone,
                address: req.body.address,
                images: req.body.images,
                services: req.body.services,
                reviews: req.body.reviews
            }, {
                new: true
            })
            .then(garage => {
                if (!garage) {
                    return res.status(404).send({
                        message: "Garage not found with id " + id
                    });
                }
                res.send(garage);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Garage not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Error updating Garage with id " + id
                });
            });

    }
}

module.exports.deleteGarage = (req, res) => {
    const id = req.params.id
    if (id == null) {
        res.json({
            status: "error",
            message: "garage id should be provided"
        })
    } else {
        Garage.findOneAndRemove({
                id
            })
            .then(garage => {
                if (!garage) {
                    return res.status(404).send({
                        message: "Garage not found with id " + id
                    });
                }
                res.send({
                    message: "Garage deleted successfully!"
                });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "Garage not found with id " + id
                    });
                }
                return res.status(500).send({
                    message: "Could not delete Garage with id " + id
                });
            });
    }
}
module.exports.getByGarageName = (req, res) => {
    const name = req.params.name
    if (name == null) {
        req.json({
            status: "error",
            message: "Garage name should be provided"
        })
    } else {
        const query = {
            name: {
                // "$regex": new RegExp(name, "i")
                "$regex": name,$options: 'i'
            }
        };

        Garage.find(query)
            .then(garage => {
                res.json(garage)
            })
            .catch(err => {
                console.log(err);
            });
    }
};