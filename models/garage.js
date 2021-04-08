const mongoose = require('mongoose')
const Services = require('./service')

const schema = mongoose.Schema

const garagesSchema = new schema({
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
    services:[{
        serviceId:{
            type:schema.Types.Number,
            ref:Service,
            required:true
        }
    }],
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

module.exports = mongoose.model('garage',garagesSchema)