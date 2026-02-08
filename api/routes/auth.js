const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email, password are required' })
    }
    try {
        const saltRounds = 10
        const hashedPassword = await bcryptjs.hash(password, saltRounds)
        const existingCount = await User.countDocuments()
        const newUser = new User({ username, email, password: hashedPassword,isAdmin: true })
        const savedUser = await newUser.save()
        const { password: _pw, ...userWithoutPassword } = savedUser.toObject()
        const jwtSecret = process.env.JWT_SECRET
        const token = jwt.sign({ id: savedUser._id, isAdmin: savedUser.isAdmin }, jwtSecret, { expiresIn: '3d' })
        res.status(201).json({ ...userWithoutPassword, token })
    } catch (err) {
        res.status(500).json({ error: 'Registration failed', details: err.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const jwtSecret = process.env.JWT_SECRET
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            jwtSecret,
            { expiresIn: '3d' }
        )

        const { password: _pw, ...userWithoutPassword } = user.toObject()
        res.status(200).json({ ...userWithoutPassword, token })
    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message })
    }
})
module.exports = router