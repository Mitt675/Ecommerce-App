const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization 
    if (!authHeader) {
        return res.status(401).json('you are not authenticated')
    }
    let token = authHeader
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const message = process.env.NODE_ENV === 'production' ? 'your token is expired' : `jwt error: ${err.name}`
            return res.status(403).json(message)
        }
        req.user = user
        next()
    })
}
const verifyTokenandAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            return next()
        }
        return res.status(403).json('you are not authorized')
    })
}
const verifytokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            return next()
        }
        return res.status(403).json('you are not authorized')
    })
}
module.exports = {verifyToken, verifyTokenandAuthorization , verifytokenAndAdmin}