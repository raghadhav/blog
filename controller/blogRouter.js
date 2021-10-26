const blogModel = require('../models/blogData')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogRouter = require('express').Router()
const { request } = require('express');


blogRouter.get('/', async (request, response) => {
  //let blogs = await blogModel.find({});
  // /console.log(`the token`, request.token)
  let blogsPromise = blogModel.find({})
    .populate('user')
  let blogs = await blogsPromise;
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(`the decoded token: `, decodedToken);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  console.log(`the user at the post is : `, user)
  const blog = new blogModel({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes
  })
  try {
    blog.save().then(savedBlog => {
      console.log('adding to user blogs', savedBlog._id);
      // concat new blog id to user
      user.blogs = user.blogs.concat(savedBlog._id);
      // update user with new blog id array
      user.save().then(() => {
        // populate response with users
        blog.populate('user').execPopulate().then((popBlog) => {
          response.json(popBlog.toJSON());
        });
      })
    });
  } catch (exception) {
    next(exception)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  // get the user of this blog
  const blog = await blogModel.findById(request.params.id)
  // compare if its valid token with the request
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const tokenUser = request.user._id
  console.log(`token user `, tokenUser);
  //console.log(`bllog user `, blog.user);
  if (tokenUser.toString() === blog.user.toString()) {
    blogModel.findByIdAndRemove(request.params.id)
      .then(delBlog => {
        response.json(delBlog.toJSON())
      })
    //return response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'User does not match the blog user' })
  }
})

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await blogModel.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  }

  blogModel.findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user')
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})
module.exports = blogRouter;
