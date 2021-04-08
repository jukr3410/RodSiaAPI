const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosastic=require("mongoosastic");
const Garage = require('./garage');
ObjectId = Schema.Types;

const servicesSchema = new Schema({
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
        ref: 'ServiceType',
        require:true
    }],
    garage:{
        type:Schema.Types.Number,
        ref:Garage
    }
})

module.exports = mongoose.model('Service',servicesSchema)