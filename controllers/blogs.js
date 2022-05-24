const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { username: true, name: true })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    content: body.content,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: request.userId,
  })

  const savedBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  Blog.findByIdAndDelete(id)

  console.log()

  res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  console.log(req.body)
  const newBlog = req.body

  const newBlogResponse = await Blog.findByIdAndUpdate(req.params.id, newBlog, { new: true })
  res.status(204).end()
})

module.exports = blogRouter
