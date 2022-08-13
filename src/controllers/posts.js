const postRouter = require("express").Router()
const Post = require("../models/post")
const { NotFoundError } = require("../utils/errors")
const middleware = require("../utils/middleware")

postRouter.get("/", async (request, response) => {
  const posts = await Post.find({}).populate("user", {
    username: true,
  })
  response.json(posts)
})

postRouter.post("/", middleware.authentication, async (request, response) => {
  const body = request.body
  const timeStamp = new Date()

  const post = new Post({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
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

postRouter.param("postId", async (req, res, next, id) => {
  try {
    const postExists = await Post.exists({ _id: id })
    if (!postExists) return next(new NotFoundError())
  } catch (e) {
    if (e.name === "CastError") return next(new NotFoundError())
  }

  next()
})

postRouter.get("/:postId", async (req, res) => {
  const postResponse = await Post.findById(req.params.postId).populate("user", {
    username: true,
  })

  res.status(200).json(postResponse)
})

postRouter.delete("/:postId", middleware.authentication, async (req, res) => {
  const id = req.params.postId

  await Post.findByIdAndDelete(id)

  res.status(204).end()
})

postRouter.put("/:postId", async (req, res, next) => {
  const newPostResponse = await Post.findByIdAndUpdate(
    req.params.postId,
    { likes: req.body.likes || null },
    {
      new: true,
    }
  ).populate("user", {
    username: true,
  })

  if (!newPostResponse) return next(new NotFoundError())

  res.json(newPostResponse)
})

postRouter.post("/:postId/comments", async (req, res, next) => {
  const newPostResponse = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $push: { comments: req.body.message },
    },
    {
      new: true,
    }
  ).populate("user", {
    username: true,
  })

  if (!newPostResponse) return next(new NotFoundError())

  res.json(newPostResponse)
})

module.exports = postRouter
