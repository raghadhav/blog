const bcrypt = require('bcrypt')
// const { request } = require('express')
// const { response } = require('../app')
const User = require('../models/user')
const Blogs = require('../models/blogData')

const usersRouter = require('express').Router()

// regsiter user
usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
  const savedUser = await user.save()

  response.json(savedUser)
})

// login user
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  .populate('blogs',{title: 1})

  response.json(users)
})
module.exports = usersRouter