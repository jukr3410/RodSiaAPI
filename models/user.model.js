const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'JWT_SUPER_SECRET';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id:{
        type:Number,
        required:[true, "can't be blank"]
    },
    name:{
        type:String,
        required:[true, "can't be blank"]
    },
    email:{
        type:String,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    phone:{
        type:String,
        required:[true, "can't be blank"],
        unique: true,
        match: [/^[0-9]+$/, 'is invalid'],
        index: true
    },
    password:{
        type:String,
        required:true
    },
    geolocation:{
        lat:String,
        long:String
    },
    cars:[{
        brand:String,
        model:String,
        type:String,
        year:String
    }],

    

});


userSchema.path('password', {
    // เข้ารหัส password 

    set: function(password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    }
});

module.exports = mongoose.model('User',userSchema);