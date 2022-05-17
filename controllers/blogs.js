const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then((blogs) => {
      response.json(blogs)
    })
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    })
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
