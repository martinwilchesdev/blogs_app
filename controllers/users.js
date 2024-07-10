const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { user: 0 })

    res.status(200).json(users)
})

userRouter.post('/', async (req, res) => {
    const body = req.body

    const saltRounds = 10
    const hashPassword = await bcrypt.hash(body.password, saltRounds)

    const newUser = new User({
        username: body.username,
        password: hashPassword,
        name: body.name
    })

    const users = await newUser.save()

    res.status(201).json(users)
})

module.exports = userRouter
