const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
// const bodyParser = require('body-parser')
const blogRouter = require('./controller/blogRouter')
const middleware = require('./utils/middleware')

//The order matters!!!
// expree.json has to come before the router!!
// so that our router can use json 
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app