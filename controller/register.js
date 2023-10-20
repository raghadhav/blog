const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const registerRouter = require('express').Router()
const User = require('../models/user')

const saltRounds = 10;

registerRouter.post('/', async (request, response) => {
  const body = request.body
  
  console.log('register', body);

  const testUser = await User.findOne({ username: body.username })
  if (testUser) {
    return response.status(401).json({
      error: 'user already exists'
    })
  }

  const passHash = await bcrypt .genSalt(saltRounds)
    .then(salt => bcrypt.hash(body.password, salt))

  const user = new User({
    username: body.username,
    passwordHash: passHash,
    name: body.username,
  })

  user.save().then(savedUser => {
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }
    const token = jwt.sign(
      userForToken, 
      process.env.SECRET,
      { expiresIn: 60*60 }
    )
    response
      .status(200)
      .send({ token, username: savedUser.username, name: savedUser.name         })
  }).catch(e => {
    return response.status(401).json({
      error: 'username and/or password must be 3 or more characters'
    })
  })

})

module.exports = registerRouter
