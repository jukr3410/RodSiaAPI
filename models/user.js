const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true       
    },
    email:{
        type:String
    },
    phone:{
        type:String,
        required:true
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
        lat:String,
        long:String
    }]
})

module.exports = mongoose.model('user',userSchema)