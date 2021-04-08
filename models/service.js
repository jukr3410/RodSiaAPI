const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Garages = require('./garages')
ObjectId = Schema.Types;

const servicesSchema = new schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    serviceType:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'serviceType',
        require:true
    }],
    garage:{
        type:Schema.Types.Number,
        ref:Garages
    }
})

module.exports = mongoose.model('service',servicesSchema)