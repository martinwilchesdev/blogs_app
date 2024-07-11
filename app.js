require('express-async-errors')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const cors = require('cors')

const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
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
app.use(middleware.extractToken)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.handleError)
app.use(middleware.unknownEndpoint)

module.exports = app