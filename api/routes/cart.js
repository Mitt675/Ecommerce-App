const express = require('express')
const router = express.Router()
const Cart = require('../model/cart')
const {verifyToken, verifyTokenandAuthorization , verifytokenAndAdmin} = require('./verify')
const { verify } = require('jsonwebtoken')

router.post('/', verifyToken, async (req, res) => {
try {
    const existingcart = await Cart.findOne({userId : req.user.id})

    if(existingcart){
        res.status(400).json('cart already exist')
    }



    const newCart = new Cart({
        userId : req.user.id,
        products : req.body.products
    })
    
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.put('/:id', verifytoken , async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedCart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.delete('/:id', verifytoken , async (req, res) => {
    try {
        const deltedCart = await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("your cart has been delted succefully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.get('/find/:userid', verifyTokenandAuthorization , async (req, res) => {
    try {
        const cart = await Cart.findOne({userId : req.params.userid})
        res.status(200).json(cart)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.get('/', verifytokenAndAdmin , async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router