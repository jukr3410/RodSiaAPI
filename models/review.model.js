const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    id: {
        type: Number,
        required: [true, "can't be blank"],
        unique: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    text: {
        type: String
    },
    star: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    garage: {
        type: Schema.Types.ObjectId,
        ref: 'Garage'
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Review', reviewSchema);