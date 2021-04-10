const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.model");
const Service = require("./service.model");

const RequestServiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: Service,
        required: true
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

});
module.exports = mongoose.model("RequestService", RequestServiceSchema);