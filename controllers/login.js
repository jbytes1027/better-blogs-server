const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

class LoginException extends Error {
  constructor(msg) {
    super()
    this.message = msg
    this.name = 'LoginException'
  }
}

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })

  try {
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!user || !isPasswordCorrect) {
      throw new LoginException('Bad Credentials')
    }
  } catch (e) {
    next(e)
    return
  }

  const userInfo = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userInfo, process.env.SECRET)

  res.json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter