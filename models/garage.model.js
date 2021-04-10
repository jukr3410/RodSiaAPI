const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const garagesSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:[true, "can't be blank"],
        unique: true,
        match: [/^[0-9]+$/, 'is invalid'],
        index: true
    },
    email:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    validatePhone:{
        type:Boolean,
        required:true
    },
    address:{
        addressDesc:{
            type:String
        },
        geolocation:{
            lat:String,
            long:String,
            required: true
        }
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'FileUpload'
    }],
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }]

})
garagesSchema.path('password', {
    // เข้ารหัส password ด้วย hash ที่นี้ password จะไม่ใช่ string แล้ว 
    // จะดึงก็ต้อง this.password.toObject() หรือ this.get('password')

    set: function(password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    }
});

garagesSchema.methods.isValidPassword = function(inputPassword, callback) {
    bcrypt.compare(inputPassword, this.password.toObject(), function(err, isMatch) {
        if(err)
            return callback(err);
        callback(null, isMatch);
    })
};
module.exports = mongoose.model('Garage',garagesSchema)