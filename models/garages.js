const mongoose = require('mongoose')
const Services = require('./services')

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
            ref:Services,
            required:true
        }
    }],
    address:{
        addressDesc:{
            type:String,
            required:true
        },
        geolocation:{
            lat:String,
            long:String,
        }
    },
    images:[String
    ]

})

module.exports = mongoose.model('garages',garagesSchema)