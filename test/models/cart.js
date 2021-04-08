const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Product = require('./product')
const User = require('./user')

const cartSchema = new Schema({
    id:{
        type:Number,
        required:true
    },
    userId:{
        type:schema.Types.Number,
        ref:User,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
   products:[
        {
            productId:{
                type:schema.Types.Number,
                ref:Product,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
   ]
})

module.exports =mongoose.model('cart',cartSchema)