const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 }).sort({'likes': -1})

    res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
    const body = req.body
    const userAuth = req.user

    if (userAuth.userid) {
        const newBlog = new Blog({
            author: body.author,
            likes: body.likes,
            title: body.title,
            url: body.url,
            user: userAuth.userid // id del usuario creador del blog
        })
        const blog = await newBlog.save()

        const user = await User.findById(userAuth.userid)
        user.blogs = user.blogs.concat(blog.id) // concatenacion de los blogs asociados a un usuario
        await user.save()

        return res.status(201).json(blog)
    } else {
        return res.status(400).json({ error: 'the user id cannot be found' })
    }
})

blogRouter.delete('/:id', async (req, res) => {
    const userAuth = req.user

    const blogToDelete = await Blog.findById(req.params.id)

    if (userAuth.userid) {
        if (blogToDelete) {
            if (userAuth.userid === blogToDelete.user.toString()) {
                await Blog.findByIdAndDelete(req.params.id)
                return res.status(204).end()
            }
            return res.status(401).json({ error: "the user is not authorized to delete the blog" })
        }

        return res.status(404).json({ error: 'the specified blog doesn\'t exist' })
    } else {
        return res.status(401).json({ error: 'the user id cannot be found' })
    }
})

blogRouter.put('/:id', async (req, res) => {
    const blogResult = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json(blogResult)
})

module.exports = blogRouter
