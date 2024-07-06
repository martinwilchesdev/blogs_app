const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(req, res) => {
    const blogs = await Blog.find({})

    res.json(blogs)
})

blogRouter.post('/', async(req, res) => {
    const blog = new Blog(req.body)
    try {
        const result = await blog.save()

        res.status(201).json(result)
    } catch(error) {
        res.status(400).end()
    }
})

blogRouter.delete('/:id', async(req, res) => {
    await Blog.findByIdAndDelete(req.params.id)

    res.status(204).end()
})

blogRouter.put('/:id', async(req, res) => {
    await Blog.findByIdAndUpdate(req.params.id, { likes: 600 })

    res.status(200).end()
})

module.exports = blogRouter