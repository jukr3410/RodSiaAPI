const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        lowercase: true
    },
    phone:{
        type:String,
        required:true,
        unique: true
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
    }]
})

module.exports = mongoose.model('user',userSchema)