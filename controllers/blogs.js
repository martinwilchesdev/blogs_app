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

module.exports = blogRouter