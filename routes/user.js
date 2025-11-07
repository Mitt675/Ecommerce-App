const express = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../model/user')
const {verifyToken , verifyTokenandAuthorization, verifytokenAndAdmin} = require('./verify')
const user = require('../model/user')
const router = express.Router()

// Update password
router.put('/:id/password', verifyTokenandAuthorization, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'currentPassword and newPassword are required' })
        }

        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const isCurrentValid = await bcryptjs.compare(currentPassword, user.password)
        if (!isCurrentValid) {
            return res.status(401).json({ error: 'Current password is incorrect' })
        }

        const saltRounds = 10
        const hashedPassword = await bcryptjs.hash(newPassword, saltRounds)

        user.password = hashedPassword
        const saved = await user.save()

        const { password: _pw, ...userWithoutPassword } = saved.toObject()
        return res.status(200).json({message:'your password is updated', userWithoutPassword})
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update password', details: err.message })
    }
})


// Update basic profile fields (username/email)
router.put('/:id', verifyTokenandAuthorization, async (req, res) => {
    try {
        const updates = {}
        if (req.body.username) updates.username = req.body.username
        if (req.body.email) updates.email = req.body.email

        if (req.body.password || req.body.currentPassword || req.body.newPassword) {
            return res.status(400).json({ error: 'Use /:id/password route to change password' })
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No updatable fields provided' })
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' })
        }

        const { password: _pw, ...userWithoutPassword } = updatedUser.toObject()
        return res.status(200).json(userWithoutPassword)
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update profile', details: err.message })
    }
})
router.delete('/:id', verifyTokenandAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user has deleted successfully')
    }
    catch(error) {
        return res.status(500).json(error)
    }
})
router.get('/', verifytokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({ createdAt: -1 }).limit(5) : await User.find()
        res.status(200).json(users)
    }
    catch (error) {
        return res.status(500).json(error)
    }
})
router.get('/stats', verifytokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.getFullYear(date.setFullYear() - 1))
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                month:{$month:"$createdAt"}
                }
            },
            {
                $group: {
                    _id: "$month",
                    total : {$sum: 1}
           }}
            
        ])
        res.status(200).json(data)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router