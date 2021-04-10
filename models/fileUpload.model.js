const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileUploadSchema = new  Schema({
    fileName: {
        type: String
    },
    
});