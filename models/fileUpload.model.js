const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileUploadSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: [true, "can't be blank"],
    //     unique: true
    // },
    fileName: {
        type: String,
        unique: true
    },
    fileLink: {
        type: String
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    garage: {
        type: Schema.Types.ObjectId,
        ref: 'Garage'
    },
    infoAssistant: {
        type: Schema.Types.ObjectId,
        ref: 'InfoAssistant'
    },
    requestService: {
        type: Schema.Types.ObjectId,
        ref: 'RequestService'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FileUpload', fileUploadSchema);