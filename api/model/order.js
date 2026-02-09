const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    userId: { required: true, type : String },
    products: [{ productId: { type: String }, quantity: { type: Number, default: 1 } }],
    address : {type : Object , required : true},
    amount: {type : Number , required : true},
    status : {type : String, required : true , default:"pending"}, 
    
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)