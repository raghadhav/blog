const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blogData')
const bcrypt = require('bcrypt')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlog)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    //console.log('begin the test')
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlog.length)
  })

  test('a specific blog is within the returned blog', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'another title'
    )
  })
})
describe('viewing a specific blog', () => {
  test('adding new Blogs', async () => {
    const res = await api
      .post(`/api/login`)
      .send({ username: 'letmein', password: '123' })
    //console.log(login)

    const token = res.body.token;
    console.log(token)
    const newBlog = {
      title: 'new blog added',
      author: 'harry potter',
    }
    await api
      .post(`/api/blogs`)
      .set({'Content-Type':'application/json', 'Authorization': `Bearer ${token}` })
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogsInDb()
    expect(blogAtEnd).toHaveLength(helper.initialBlog.length + 1)

  })
  test('adding new Blogs without login', async () => {
    const newBlog = {
      title: 'new blog added',
      author: 'harry potter',
    }
    await api
      .post(`/api/blogs`)
      .send(newBlog)
      .expect(401)
  })

  // test('blog without title is not added', async () => {
  //   const newBlog = {
  //     author: 'no title'
  //   }
  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(200)

  //   //const blogAtEnd = await helper.blogsInDb()

  //   //expect(blogAtEnd).toHaveLength(helper.initialBlog.length)
  // })
  test('blog can be views with valid ID', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const BlogToView = blogsAtStart[0];
    const resultBlog = await api
      .get(`/api/blogs/${BlogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(BlogToView))
    expect(resultBlog.body).toEqual(processedBlogToView)

  })
})
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const title = blogsAtEnd.map(r => r.title)

    expect(title).not.toContain(blogToDelete.title)
  })
})

describe('updating a specific blog', () => {
  test('update new Blog ', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]

    const updatedBlog = {
      author: 'put author',
      title: 'updated title',

    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    const title = blogsAtEnd.map(r => r.title)
    expect(title).toContain(updatedBlog.title)
  })
})

describe('when there is one User in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test(`test users in DB`, async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const user1 = usersAtEnd.map(u => u.username)
    expect(user1).toContain(newUser.username)
  })
  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})
// to colse the db finishing the run 
afterAll(() => {
  mongoose.connection.close();
})