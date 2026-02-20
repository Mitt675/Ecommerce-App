const mongoose = require('mongoose')


const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]

}, { timestamps: true })
