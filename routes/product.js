const express = require('express')
const router = express.Router()
const Product = require('../model/product')
const { verifyToken, verifyTokenandAuthorization, verifytokenAndAdmin } = require('./verify')


router.post('/', verifytokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.put('/:id', verifytokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedProduct)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.delete('/:id', verifytokenAndAdmin, async (req, res) => {
    try {
        const deltedProduct = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("your product has been delted succefully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.get('/', async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let product;
        if (qNew) {
            product = await Product.find().sort({createdAt : -1}).limit(2)
        }
        else if (qCategory) {
            product = await Product.find({categories :{$in :[qCategory]}})
        }
        else {
            product = await Product.find()
        }
        res.status(200).json(product)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router