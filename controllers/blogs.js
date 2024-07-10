const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async(req, res) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})

    res.json(blogs)
})

blogRouter.post('/', async(req, res) => {
    const body = req.body

    const user = await User.findById(body.userid)

    if (user) {
        const newBlog = new Blog({
            author: body.author,
            likes: body.likes,
            title: body.title,
            url: body.url,
            user: body.userid // id del usuario creador del blog
        })

        const blog = await newBlog.save()

        // concatenacion de los blogs asociados a un usuario
        user.blogs = user.blogs.concat(blog.id)
        await user.save()

        return res.status(201).json(blog)
    } else {
        return res.status(400).json({ error: 'the user doesn\'t exist' })
    }
})

blogRouter.delete('/:id', async(req, res) => {
    await Blog.findByIdAndDelete(req.params.id)

    res.status(204).end()
})

blogRouter.put('/:id', async(req, res) => {
    const blogResult = await Blog.findByIdAndUpdate(req.params.id, { likes: 600 }, { new: true })

    res.status(200).json(blogResult)
})

module.exports = blogRouter
