const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'JWT_SUPER_SECRET';

const Schema = mongoose.Schema;

const garageSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: [true, "can't be blank"],
    // },
    name: {
        type: String,
        required: [true, "can't be blank"],
    },
    phone: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
        match: [/^[0-9]+$/, "is invalid"],
        index: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: true,
    },
    validatePhone: {
        type: Boolean,
        required: true,
    },
    address: {
        addressDesc: {
            type: String,
        },
        geolocation: {
            lat: {
                type: String,
            },
            long: {
                type: String,
            },
        },

    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: "FileUpload",
    }, ],
    services: [{
        type: Schema.Types.ObjectId,
        ref: "Service",
    }, ],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }, ],
});


garageSchema.path("password", {
    // เข้ารหัส password ด้วย hash ที่นี้ password จะไม่ใช่ string แล้ว
    // จะดึงก็ต้อง this.password.toObject() หรือ this.get('password')

    set: function (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    },
});

garageSchema.methods.isValidPassword = function (inputPassword, findPassword, callback) {
    bcrypt.compare(
        inputPassword,
        findPassword.this.password.toObject(),
        function (err, isMatch) {
            if (err) return callback(err);
            callback(null, isMatch);
        }
    );
};
module.exports = mongoose.model("Garage", garageSchema);