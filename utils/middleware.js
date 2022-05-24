const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

class InvalidTokenException extends Error {
  constructor() {
    super()
    this.message = 'Invalid Token'
    this.name = 'InvalidTokenException'
  }
}

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, request.body)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  try {
    if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
      throw (new InvalidTokenException())
    }
    const token = authorization.substring(7)

    const tokenPayload = jwt.verify(token, process.env.SECRET)

    if (!tokenPayload || !tokenPayload.id) {
      throw (new InvalidTokenException())
    }

    req.userId = tokenPayload.id
    req.user = await User.findById(tokenPayload.id)

    next()
  } catch (e) {
    next(e)
    return
  }
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  } else if (error.name === 'UserCreationException') {
    response.status(400).json({ error: error.message })
  } else if (error.name === 'LoginException') {
    response.status(401).json({ error: error.message })
  } else if (error.name === 'InvalidTokenException') {
    response.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}
