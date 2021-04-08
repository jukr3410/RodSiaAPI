const mongoose = require('mongoose')
const schema = mongoose.Schema

const infoAssistantSchema = new schema({
    id:{
        type:Number,
        required:true
    },
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
module.exports = mongoose.model('infoAssistant',infoAssistantSchema)