require('express-async-errors')
const cors = require('cors')
// const bodyParser = require('body-parser')

const blogRouter = require('./controller/blogRouter')
const usersRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const registerRouter = require('./controller/register')
const middleware = require('./utils/middleware')


const express = require('express')
const app = express()
//The order matters!!!
// expree.json has to come before the router!!
// so that our router can use json 
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/register', registerRouter)
app.use('/api/login', loginRouter)


if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controller/testing')
    app.use('/api/testing', testingRouter)
}

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
