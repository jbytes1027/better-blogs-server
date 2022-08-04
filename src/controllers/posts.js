const postRouter = require("express").Router()
const Post = require("../models/post")
const middleware = require("../utils/middleware")

postRouter.get("/", async (request, response) => {
  const posts = await Post.find({}).populate("user", {
    username: true,
  })
  response.json(posts)
})

postRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body
  const timeStamp = new Date()

  const post = new Post({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: request.userId,
    time: timeStamp.toISOString(),
    comments: [],
  })

  const savedPost = await post.save()
  const populatedPost = await Post.findById(savedPost._id).populate("user", {
    username: true,
  })

  request.user.posts = request.user.posts.concat(savedPost._id)
  await request.user.save()

  response.status(201).json(populatedPost)
})

postRouter.delete("/:id", async (req, res) => {
  const id = req.params.id

  await Post.findByIdAndDelete(id)

  res.status(204).end()
})

postRouter.put("/:id", async (req, res) => {
  const newPost = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  }

  const newPostResponse = await Post.findByIdAndUpdate(req.params.id, newPost, {
    new: true,
  }).populate("user", {
    username: true,
  })

  if (!newPostResponse) {
    res.status(404).end()
  } else {
    res.json(newPostResponse)
  }
})

postRouter.post("/:id/comments", async (req, res) => {
  const newPostResponse = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: { comments: req.body.message },
    },
    {
      new: true,
    }
  ).populate("user", {
    username: true,
  })

  if (!newPostResponse) {
    res.status(404).end()
  } else {
    res.json(newPostResponse)
  }
})

module.exports = postRouter
