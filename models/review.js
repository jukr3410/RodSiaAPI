const mongoose = require('mongoose')
const Garage = require('./garage') 


const schema = mongoose.Schema

const reviewSchema = new schema({
    id:{
        type:Number,
        required:true
    },
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
        type:schema.Types.Number,
        ref:Garage,
        required:true       
    }
    
})
module.exports = mongoose.model('review',reviewSchema)