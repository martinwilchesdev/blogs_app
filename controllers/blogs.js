const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

const generateToken = (req) => {
    const token = req.get('authorization')

    return token?.replace('Bearer ', '')
}

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 })

    res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
    const body = req.body

    const userToken = jwt.verify(generateToken(req), process.env.SECRET)

    if (userToken.userid) {
        const newBlog = new Blog({
            author: body.author,
            likes: body.likes,
            title: body.title,
            url: body.url,
            user: userToken.userid // id del usuario creador del blog
        })
        const blog = await newBlog.save()

        const user = await User.findById(userToken.userid)
        user.blogs = user.blogs.concat(blog.id) // concatenacion de los blogs asociados a un usuario
        await user.save()

        return res.status(201).json(blog)
    } else {
        return res.status(400).json({ error: 'the user id cannot be found' })
    }
})

blogRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)

    res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
    const blogResult = await Blog.findByIdAndUpdate(req.params.id, { likes: 600 }, { new: true })

    res.status(200).json(blogResult)
})

module.exports = blogRouter
