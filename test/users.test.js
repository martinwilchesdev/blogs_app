const { test, describe, before, after } = require('node:test')
const assert = require('node:assert')

const supertest = require('supertest')
const mongoose = require('mongoose')

const User = require('../models/user')

const helper = require('../helpers/users')
const app = require('../app')
const api = supertest(app)

describe('http post request to', () =>  {
    before(async() => {
        await User.deleteMany({})
    })

    test('get a 201 status code when a new user has been created', async() => {
        const usersAtStart = await helper.getUsers()

        const newUser = {
            username: 'alovelace',
            password: 'Aa123456.',
            name: 'Ada Lovelace'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.getUsers()

        assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
    })

    test('get a 409 status code when the username already exist', async() => {
        const usersAtStart = await helper.getUsers()

        const newUser = {
            username: 'alovelace',
            password: 'Aa123456.',
            name: 'Ada Lovelace'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(409)

        const usersAtEnd = await helper.getUsers()

        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    after(async() => {
        mongoose.connection.close()
    })
})