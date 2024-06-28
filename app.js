const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const cors = require('cors')

const blogRouter = require('./controllers/blogs')
const app = express()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
    .then(success => {
        logger.info('connected to db')
    })
    .catch(error => {
        logger.error('error connecting to db')
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app