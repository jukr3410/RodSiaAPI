const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.model");
const Service = require("./service.model");

const requestServiceSchema = new Schema({
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