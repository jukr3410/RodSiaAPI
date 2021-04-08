const mongoose = require('mongoose')
const Garage = require('./garage') 
const schema = mongoose.Schema

const serviceSchema = new schema({
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
    garagesId:[{
    type:schema.Types.Number,
    ref:Garage   
    }]
})

module.exports = mongoose.model('service',serviceSchema)