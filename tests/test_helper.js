const Blog = require('../models/blogData')

const initialBlog = [
    {
      title: 'HTML is easy',
      author: 'new author',
      url: 'something.com',
      likes: 12
    },
    {
      title: 'another title',
      author: 'new author',
      url: 'something.com',
      likes: 11
    },
  ]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Harry' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlog, nonExistingId, blogsInDb
}