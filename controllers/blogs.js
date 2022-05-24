const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: true, name: true })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const creatorId = await User.findOne({}) // temp
  const userCreator = await User.findById(creatorId)

  const blog = new Blog({
    content: body.content,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: creatorId,
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
