const { test, after, before, describe } = require('node:test')
const assert = require('node:assert')

const Blog = require('../models/blog')
const mongoose = require('mongoose')
const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

const initialBlogs = [
    {
        title: 'A national anthem',
        author: 'Beaver Caret',
        url: 'http://anational.com',
        likes: 200
    }
]

before(async() => {
    await Blog.deleteMany({})
    console.log('database cleaned')

    const newBlogs = new Blog(initialBlogs[0])
    await newBlogs.save()
})

describe('http request to api', async() => {
    test('get the exactly quantity of blogs', async() => {
        const blogs = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(blogs.body.length, initialBlogs.length)
    })

    test('validate that the property id exist on the request object', async() => {
        const blogResult = await api.get('/api/blogs')

        assert(blogResult.body[0].hasOwnProperty('id'))
    })

    test('add a new blog', async() => {
        const newBlog = {
            title: 'A beautiful mind',
            author: 'Kansas Olyck',
            url: 'http://abeautiful.com',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await Blog.find({})

        assert.strictEqual(blogs.length, initialBlogs.length + 1)
    })

    test('if likes property doesn\'t exist in the request, it must be 0', async() => {
        const newBlog = {
            title: 'Animal story',
            author: 'Charles Victory',
            url: 'http://animalstory.com'
        }

        const resultBlog = await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(resultBlog.body.likes, 0)
    })

    test('validate required fields title and url', async() => {
        const newBlog = {
            'author': 'Montesquieu',
            'likes': 100
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('delete a valid note', async() => {
        const blogsAtStart = await Blog.find({})
        const blogToView = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToView.id}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({})
        const blogsIds = blogsAtEnd.map(blog => blog.id)

        assert(!blogsIds.includes(blogToView.id))
    })

    test('update likes property to a valid blog', async() => {
        const blogsAtStart = await Blog.find({})
        const blogToView = blogsAtStart[0]

        const blogResult = await api
            .put(`/api/blogs/${blogToView.id}`)
            .expect(200)

        assert.strictEqual(blogResult.body.likes, 600)
    })
})

after(async() => {
    await mongoose.connection.close()
})