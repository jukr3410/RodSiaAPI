const mongoose = require('mongoose')



const Schema = mongoose.Schema

const reviewSchema = new Schema({
   
    request:{
        type:Schema.Types.ObjectId,
        ref: 'RequestService',
        required:true
    },
    Text:String,
    star:{
        type:Number,
        required:true
    },
    garage:{
        type:Schema.Types.ObjectId,
        ref: 'Garage',
        required:true
    }
    
})
module.exports = mongoose.model('Review',reviewSchema)