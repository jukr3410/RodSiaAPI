const mongoose = require('mongoose')
const schema = mongoose.Schema
const Garages = require('./garage')

const servicesSchema = new schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    serviceType:{
        type:String,
        require:true
    },
    garages:[{
        garagesId:{
        type:schema.Types.Number,
        ref:Garages
       }
    }]
})

module.exports = mongoose.model('service',servicesSchema)