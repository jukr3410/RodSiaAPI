const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const garagesSchema = new Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    Phone:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    validatePhone:{
        type:Boolean,
        required:true
    },
    address:{
        addressDesc:{
            type:String
        },
        geolocation:{
            lat:String,
            long:String,
        }
    },
    images:[String]

})

module.exports = mongoose.model('Garage',garagesSchema)