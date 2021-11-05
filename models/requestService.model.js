const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.model");
const Service = require("./service.model");
const Garage = require('./garage.model')

const requestServiceSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: [true, "can't be blank"],
    //     unique: true
    // },
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    garage: {
        type: Schema.Types.ObjectId,
        ref: Garage
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: Service
    },
    car: {
        brand: {
            type: String
        },
        model: {
            type: String
        },
        type: {
            type: String
        },
        year: {
            type: String
        },
        fuelType: {
            type: String
        }
    },
    geoLocationUser: {
        lat: {
            type: String,
            //required: true
        },
        long: {
            type: String,
            //required: true
        },
    },

    geoLocationGarage: {
        lat: {
            type: String,
            //required: true
        },
        long: {
            type: String,
            //required: true
        },
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
    },
    image: {
        type: String,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("RequestService", requestServiceSchema);