const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")
const { AuthenticationError } = require("../utils/errors")
const { JWT_SECRET } = require("../utils/config")

loginRouter.post("/", async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })

  if (!user) return next(new AuthenticationError("Invalid username"))
  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect)
    return next(new AuthenticationError("Invalid password"))

  const userInfo = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userInfo, JWT_SECRET)

  res.json({ token, username: user.username, id: user.id })
})

module.exports = loginRouter
