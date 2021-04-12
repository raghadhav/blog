const blogRouter = require('express').Router()
const blogModel = require('../models/blogData')

// blogRouter.get('/', (request, response) => {
//     response.send('test again change')
//     console.log('is it working?')
// })

// blogRouter.get('/api/blogs', (request, response) => {
//     blogModel
//         .find({})
//         .then(blogs => {
//             response.json(blogs)
//         })
// })
blogRouter.get('/', async (request, response) => {
    //let blogs = await blogModel.find({});
    let blogsPromise = blogModel.find({});
    let blogs = await blogsPromise;
    response.json(blogs)

})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    const blog = new blogModel({
        title: body.title,
        author: body.author
    })
    try {
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})
blogRouter.delete('/:id', async (request, response, next) => {
 
      await blogModel.findByIdAndRemove(request.params.id)
      response.status(204).end()

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
    }
  
    blogModel.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog.toJSON())
      })
      .catch(error => next(error))
  })
module.exports = blogRouter;
