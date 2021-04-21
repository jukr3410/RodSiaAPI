const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'JWT_SUPER_SECRET';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: [true, "can't be blank"]
    // },
    name: {
        type: String,
        required: [true, "can't be blank"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    phone: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
        match: [/^[0-9]+$/, 'is invalid'],
        index: true
    },
    password: {
        type: String,
        required: true
    },
    validatePhone: {
        type: Boolean,
        required: true
    },
    cars: [{
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
    }],

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    requestServices: [{
        type: Schema.Types.ObjectId,
        ref: 'RequestService'
    }]
}, {
    timestamps: true
});


userSchema.path('password', {
    // เข้ารหัส password ด้วย hash ที่นี้ password จะไม่ใช่ string แล้ว 
    // จะดึงก็ต้อง this.password.toObject() หรือ this.get('password')

    set: function (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    }
});

userSchema.methods.isValidPassword = function (inputPassword, callback) {
    bcrypt.compare(inputPassword, this.password.toObject(), function (err, isMatch) {
        if (err)
            return callback(err);
        callback(null, isMatch);
    })
};

module.exports = mongoose.model('User', userSchema);