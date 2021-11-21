const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,
    },
    imageLink: {
        type: String
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);