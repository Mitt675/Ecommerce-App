const router = require('express').Router()
const Order = require('../model/order')
const Stripe = require('stripe')
const { verifyToken } = require('./verify')

const stripe = process.env.STRIPE_KEY



router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json('orderId is required')
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json('Order not found')
    }

    if (order.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json('Not authorized')
    }

    if (order.status !== 'pending') {
      return res.status(400).json('Order already processed')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order ${order._id}`
            },
            unit_amount: order.amount * 100
          },
          quantity: 1
        }
      ],

      metadata: {
        orderId: order._id.toString()
      },

      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel'
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json(err.message)
  }
})

module.exports = router
