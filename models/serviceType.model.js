const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
    id:{
        type:Number,
        required:true
    },name:{
        type: String,
        unique: true,
        lowercase: true
    }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);