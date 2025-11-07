const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    categories: { type: Array },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    stock: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)