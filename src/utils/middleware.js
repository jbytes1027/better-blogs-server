const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

class InvalidTokenException extends Error {
  constructor() {
    super()
    this.message = "Invalid Token"
    this.name = "InvalidTokenException"
  }
}

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, request.body)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get("authorization")

  if (!(authorization && authorization.toLowerCase().startsWith("bearer ")))
    return next(new InvalidTokenException())

  const token = authorization.substring(7)

  const tokenPayload = jwt.verify(token, process.env.SECRET)

  if (!tokenPayload || !tokenPayload.id)
    return next(new InvalidTokenException())

  req.userId = tokenPayload.id
  req.user = await User.findById(tokenPayload.id)

  next()
}

const errorResponder = (error, request, response, next) => {
  logger.error(error.message)
  console.log(error)

  if (error) response.status(error.statusCode).json({ error: error.message })

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorResponder,
  userExtractor,
}
