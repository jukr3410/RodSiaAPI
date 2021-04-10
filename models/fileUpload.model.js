const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileUploadSchema = new  Schema({
    fileName: {
        type: String
    },
    filePath: {
        type: String
    },
    service: {
        type: Schema.Types.ObjectId, ref: 'Service'
    },
    garage: {
        type: Schema.Types.ObjectId, ref: 'Garage'
    },
    infoAssistant: {
        type: Schema.Types.ObjectId, ref: 'InfoAssistant'
    }
});

module.exports = mongoose.model('FileUpload', fileUploadSchema);