const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true},
    img: { type: String, required: true },
    categories: { type: Array },
    price: { type: Number, required: true },
    size: { type: Array },
    color: { type: String },
    stock: { type: Number, default: 0 },
    inStock : {type : Boolean, default: true}
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)