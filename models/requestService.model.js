const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.model");
const Service = require("./service.model");

const RequestServiceSchema = new Schema({
    id: {
        type: Number,
        required: [true, "can't be blank"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: Service
    },

    geolocation: {
        lat: String,
        long: String,
        required: true
    },

    problemDesc: {
        type: String
    },
    confirmRequest: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        required: true
    }

} , {timestamps: true});
module.exports = mongoose.model("RequestService", requestServiceSchema);