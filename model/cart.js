const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userId: { required: true, unique: true , type : String },
    products : [{procutId :{type : String },quantity : {type : Number , default : 1}}]
}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema)