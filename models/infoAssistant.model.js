const mongoose = require('mongoose')
const Schema = mongoose.Schema

const infoAssistantSchema = new Schema({

    id: {
        type: Number,
        required: [true, "can't be blank"]
    },
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceType'
    },
    problemObserve: {
        type: String,
        required: true
    },
    desc: {type: String},
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'FileUpload'
    }]

})
module.exports = mongoose.model('InfoAssistant', infoAssistantSchema)