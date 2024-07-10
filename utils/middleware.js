const logger = require('../utils/logger')

const handleError = (error, req, res, next) => {
    logger.error(error.message)

    res.status(400).json({ error: error.message })
}

module.exports = {
    handleError
}
