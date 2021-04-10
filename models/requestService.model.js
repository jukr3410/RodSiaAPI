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

    geolocation: {
        lat: String,
        long: String,
    },
    service: [{
        type: Schema.Types.ObjectId,
        ref: Service,
        required: true,
    }, ],
    problemDesc: String,
});
module.exports = mongoose.model("RequestService", RequestServiceSchema);