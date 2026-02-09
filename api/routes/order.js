const express = require('express')
const router = express.Router()
const Order = require('../model/order')
const { verifyToken, verifyTokenandAuthorization, verifytokenAndAdmin } = require('./verify')
const { route } = require('./cart')

//to create a new order
router.post('/', verifyToken, async (req, res) => {
   try { const newOrder = new Order({
        userId : req.user.id,
        address : req.body.address,
        products : req.body.products,
        amount : req.body.amount
    })
    
        const savedOrder = await newOrder.save()
        res.status(201).json(savedOrder)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//to update an order
router.put('/:id', verifytokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedOrder)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//to delete an order
router.delete('/:id', verifytokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('order has been deleted')
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//to get all orders of a user
router.get('/find/:userId', verifyToken , async (req, res) => {
    try {
        if(req.user.id !== req.params.id && req.body.isAdmin){
            return res.status(403).json('Not authorized')
        }

        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//to get all orders
router.get('/', verifytokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//to get monthly income 
router.get('/income', verifytokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            {
                $match: { createdAt: { $gte: previousMonth } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        res.status(200).json(income)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router


