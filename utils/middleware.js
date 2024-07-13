const logger = require('../utils/logger')

const jwt = require('jsonwebtoken')

const unknownEndpoint = (req, res, next) => {
    res.status(404).json({error: 'unreachable endpoint'})
    next()
}

const handleError = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return res.status(409).json({ error: 'the username must be unique' })
    } else if (error.name === 'CastError' && error.message.includes('Cast to ObjectId failed')) {
        return res.status(400).json({ error: 'the formated of the id is invalid' })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'the user cannot do this action' })
    } else {
        return res.status(400).json({ error: error.message })
    }
}

const extractToken = (req, res, next) => {
    const token = req.get('authorization')?.replace('Bearer ', '')
    req.token = token !== undefined
        ? token
        : null

    next()
}

const extractUser = (req, res, next) => {
    req.user = jwt.verify(req.token, process.env.SECRET)

    next()
}

module.exports = { handleError, unknownEndpoint, extractToken, extractUser }
