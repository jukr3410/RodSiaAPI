const mongoose = require('mongoose')
const schema = mongoose.Schema
const User = require('./user')
const Service = require('./service')

const RequestServiceSchema = new schema({
    id:{
        type:Number,
        required:true
    },
    requestUser:{
        userId:{
            type:schema.Types.Number,
            ref:User,
            required:true
        },
        geolocation:{
            lat:String,
            long:String
        }
    },
    serviceId:[{
        type:schema.Types.Number,
        ref:Service,
        required:true
        }
    ],
    problemDesc:String,
    

})
module.exports = mongoose.model('requestService',RequestServiceSchema)