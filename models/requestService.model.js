const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user.model')
const Service = require('./service.model')

const RequestServiceSchema = new Schema({
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
module.exports = mongoose.model('RequestService',RequestServiceSchema)