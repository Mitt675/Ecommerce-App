const express = require('express')
const router = express.Router()
const Cart = require('../model/cart')
const {verifyToken, verifyTokenandAuthorization , verifytokenAndAdmin} = require('./verify')

router.post('/', verifyTokenandAuthorization, async (req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save()
        res.status(200).json(newCart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.put('/:id', verifyTokenandAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedCart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.delete('/:id', verifyTokenandAuthorization, async (req, res) => {
    try {
        const deltedCart = await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("your cart has been delted succefully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.get('/find/:userid', verifyTokenandAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId : req.params.userid})
        res.status(200).json(cart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.get('/', verifytokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router