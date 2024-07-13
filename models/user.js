const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: [3, 'the username is too short'],
        unique: true
    },
    password: {
        type: String,
        minLength: [3, 'the password is too short']
    },
    name: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
        delete obj.password
    }
})

module.exports = mongoose.model('User', userSchema)