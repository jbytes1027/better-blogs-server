const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/user")

class UserCreationException extends Error {
  constructor(msg) {
    super()
    this.message = msg
    this.name = "UserCreationException"
  }
}

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
  const { username, name, password } = req.body

  try {
    if (!username || username.length < 3) {
      throw new UserCreationException("Username missing or too short")
    }

    if (!password || password.length < 3) {
      throw new UserCreationException("Password missing or too short")
    }

    let allUsers = await User.find({}).then((result) =>
      result.map((user) => user.toJSON())
    )

    const foundUser = allUsers.find(
      (user) => user !== null && user.username === username
    )

    if (foundUser) {
      throw new UserCreationException("User already exists")
    }
  } catch (e) {
    next(e)
    return
  }

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
