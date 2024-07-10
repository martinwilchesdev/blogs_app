const User = require('../models/user')

const getFirstUser = async() => {
    const user = await User.find({})

    return user[0]
}

module.exports = { getFirstUser }