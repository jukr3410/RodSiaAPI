
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosastic = require("mongoosastic");
const Garage = require('./garage.model');
const ServiceType = require('./serviceType.model');

const servicesSchema = new Schema({
   
    name:{
        type:String,
        required: [true, 'Name must not be emtpy']
    },
    description: {
        type: String
    },
    serviceType:[{
        type:Schema.Types.ObjectId, 
        ref: ServiceType
    }],
    garage:{
        type:Schema.Types.ObjectId,
        ref:Garage
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'FileUpload'
    }]
});

module.exports = mongoose.model('Service',servicesSchema);

