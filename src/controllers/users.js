const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/user")
const { DuplicateResourceError, RequestError } = require("../utils/errors")

userRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("posts", {
    title: true,
    author: true,
    url: true,
    likes: true,
  })

  res.json(user)
})

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("posts", {
    title: true,
    author: true,
    url: true,
    likes: true,
  })

  res.json(users)
})

userRouter.post("/", async (req, res, next) => {
  const { username, password } = req.body

  if (!username || username.length < 3)
    return next(new RequestError("Username missing or too short"))

  if (!password || password.length < 3)
    return next(new RequestError("Password missing or too short"))

  let allUsers = await User.find({}).then((result) =>
    result.map((user) => user.toJSON())
  )

  const foundUser = allUsers.find(
    (user) => user !== null && user.username === username
  )

  if (foundUser) return next(new DuplicateResourceError())

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    passwordHash,
  })

  const savedUser = await newUser.save()

  res.status(201).json(savedUser)
})

module.exports = userRouter
