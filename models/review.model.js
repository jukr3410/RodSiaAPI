const mongoose = require('mongoose')
const Garage = require('./garage.model') 


const Schema = mongoose.Schema

const reviewSchema = new Schema({
   
    requestId:{
        type:schema.Types.Number,
        ref:RequestService,
        required:true
    },
    Text:String,
    star:{
        type:Number,
        required:true
    },
    garagesId:{
        type:Schema.Types.Number,
        ref:Garage,
        required:true
    }
    
})
module.exports = mongoose.model('Review',reviewSchema)