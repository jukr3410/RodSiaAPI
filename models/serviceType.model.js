const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
    
    name:{
        type: String,
        unique: true,
        lowercase: true
    }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);