const Review = require('../models/review.model')

module.exports.getAllReview = (req, res) => {
    const limit = Number(req.query.limit) || 0
    const sort = req.query.sort == "desc" ? -1 : 1

    Review.find().select(['-_id']).limit(limit).sort({
            id: sort
        })
        .then(reviews => {
            res.json(reviews)
        })
        .catch(err => console.log(err))
}

module.exports.getReview = (req, res) => {
    const id = req.params.id

    Review.findOne({
            id
        }).select(['-_id'])
        .then(review => {
            res.json(review)
        })
        .catch(err => console.log(err))
}



module.exports.addReview = (req, res) => {
    if (typeof req.body == undefined) {
        res.json({
            status: "error",
            message: "data is undefined"
        })
    } else {
        let reviewCount = 0;
        Review.find().countDocuments(function (err, count) {
                reviewCount = count
            })
            .then(() => {
                const review = new Review({
                    id: reviewCount + 1,
                    service: req.body.service,
                    text: req.body.text,
                    star: req.body.star,
                    user: req.body.user,
                    garage: req.body.garage
                })
                review.save()
                    .then(review => res.json(review))
                    .catch(err => console.log(err))

                res.json(review)
            })

        // res.json({id:Review.find().count()+1,...req.body})
    }
}

module.exports.editReview = (req, res) => {
    if (typeof req.body == undefined || req.params.id == null) {
        res.json({
            status: "error",
            message: "something went wrong! check your sent data"
        })
    } else {
        res.json({
            id: req.body.id,
            service: req.body.service,
            text: req.body.text,
            star: req.body.star,
            user: req.body.user,
            garage: req.body.garage
        })
    }
}

module.exports.deleteReview = (req, res) => {
    if (req.params.id == null) {
        res.json({
            status: "error",
            message: "review id should be provided"
        })
    } else {
        Review.findOne({
                id: req.params.id
            })
            .select(['-_id'])
            .then(review => {
                res.json(review)
            })
            .catch(err => console.log(err))
    }
}