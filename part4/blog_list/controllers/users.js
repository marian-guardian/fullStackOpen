const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')




usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
    const body = req.body

    if (!body.password || body.password.length < 3) {
        return res.status(400).json({ error: 'password must be provided and be at least 3 characters long' })
    }

    try {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()
        res.json(savedUser)
    } catch (exception) {
        next(exception)
    }


})

module.exports = usersRouter