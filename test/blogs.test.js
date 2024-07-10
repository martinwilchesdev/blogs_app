const { test, after, before, describe } = require('node:test')
const assert = require('node:assert')

const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('../helpers/blogs')
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

describe('http request get', async() => {
    test('exactly quantity of blogs', async() => {
        const blogs = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(blogs.body.length, initialBlogs.length)
    })

    test('to validate that the property id exist on the request object', async() => {
        const blogResult = await api.get('/api/blogs')

        assert(blogResult.body[0].hasOwnProperty('id'))
    })
})

describe('http request post', async() => {
    test('to add a new blog', async() => {
        const user = await helper.getFirstUser()

        const newBlog = {
            title: 'A beautiful mind',
            author: 'Kansas Olyck',
            url: 'http://abeautiful.com',
            likes: 5,
            userid: user.id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await Blog.find({})

        assert.strictEqual(blogs.length, initialBlogs.length + 1)
    })

    test('to validate if likes property doesn\'t exist in the request, it must be saves as 0', async() => {
        const user = await helper.getFirstUser()

        const newBlog = {
            title: 'Animal story',
            author: 'Charles Victory',
            url: 'http://animalstory.com',
            userid: user.id
        }

        const resultBlog = await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(resultBlog.body.likes, 0)
    })

    test('to validate if the title and URL fields exist in the request', async() => {
        const newBlog = {
            'author': 'Montesquieu',
            'likes': 100
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})

describe('http request delete', async() => {
    test('a valid note', async() => {
        const blogsAtStart = await Blog.find({})
        const blogToView = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToView.id}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({})
        const blogsIds = blogsAtEnd.map(blog => blog.id)

        assert(!blogsIds.includes(blogToView.id))
    })
})

describe('http request put', async() => {
    test('to update likes property to a valid blog', async() => {
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