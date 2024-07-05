const { test, after, before, describe } = require('node:test')
const assert = require('node:assert')

const Blog = require('../models/blog')
const mongoose = require('mongoose')
const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

const initialBlogs = [
    {
        "title": "A national anthem",
        "author": "Beaver Caret",
        "url": "http://anational.com",
        "likes": 200
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
        const blogs = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(blogs.body.length, initialBlogs.length)
    })
})

after(async() => {
    await mongoose.connection.close()
})