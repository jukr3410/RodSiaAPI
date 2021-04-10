const mongoose = require('mongoose')
const Schema = mongoose.Schema

const infoAssistantSchema = new Schema({

    id: {
        type: Number,
        required: [true, "can't be blank"]
    },
    serviceType: {
        type: Schema.Types.ObjectId,
        required: true
    },
    problemObserve: {
        type: String,
        required: true
    },
    desc: String,
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'FileUpload'
    }]

})
module.exports = mongoose.model('InfoAssistant', infoAssistantSchema)