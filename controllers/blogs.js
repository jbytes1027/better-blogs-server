const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

class InvalidTokenException extends Error {
  constructor() {
    super()
    this.message = 'Invalid Token'
    this.name = 'InvalidTokenException'
  }
}

const decodeTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    return jwt.verify(token, process.env.SECRET)
  } else {
    return null
  }
}

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { username: true, name: true })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = decodeTokenFrom(request)
  if (!token || !token.id) {
    next(new InvalidTokenException())
    return
  }
  const userCreator = await User.findById(token.id)

  const blog = new Blog({
    content: body.content,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userCreator._id,
  })

  const savedBlog = await blog.save()

  userCreator.blogs = userCreator.blogs.concat(savedBlog._id)
  await userCreator.save()

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
