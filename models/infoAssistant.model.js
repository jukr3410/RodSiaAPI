const mongoose = require('mongoose')
const Schema = mongoose.Schema

const infoAssistantSchema = new Schema({
 
    serviceType:{
        type:String
    },
    problemObserve:{
        type:String,
        required:true
    },
    desc:String,
    images:[String]

})
module.exports = mongoose.model('InfoAssistant',infoAssistantSchema)