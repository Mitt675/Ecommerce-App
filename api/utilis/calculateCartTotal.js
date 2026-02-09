const product = require('../model/product')
const Product = require('../model/product')

const calculateCartTotal = async (cartProducts){
  let total = 0 

  for (const item of cartProducts){
    const product = await Product.findById(item.productId)
    if(!product){
      throw new Error('product not found')
    }
    total += product.price * item.quantity
  }

  return total
}

module.exports = calculateCartTotal