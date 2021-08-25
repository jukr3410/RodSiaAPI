const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const service = require('./service.model')

const serviceTypeSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: [true, "can't be blank"]
    // },
    name: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);