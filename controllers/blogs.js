const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

module.exports = blogRouter