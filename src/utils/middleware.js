const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const { AuthenticationError, RequestError } = require("./errors")

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, request.body)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const authentication = async (req, res, next) => {
  const authorization = req.get("authorization")

  if (!(authorization && authorization.toLowerCase().startsWith("bearer ")))
    return next(new AuthenticationError("Invalid Token"))

  const token = authorization.substring(7)

  let tokenPayload
  try {
    tokenPayload = jwt.verify(token, process.env.SECRET)
  } catch (e) {
    if (e.name === "JsonWebTokenError")
      return next(new AuthenticationError("Invalid Token"))
  }

  if (!tokenPayload || !tokenPayload.id)
    return next(new AuthenticationError("Invalid Token"))

  req.userId = tokenPayload.id
  req.user = await User.findById(tokenPayload.id)

  next()
}

const errorResponsePicker = (err, req, res, next) => {
  logger.error(err)
  if (err.name === "ValidationError") return next(new RequestError(err.message))

  next(err)
}

const errorResponder = (error, request, response, next) => {
  if (!(error instanceof RequestError)) return next(error)

  logger.error(error.message)

  response.status(error.statusCode).json({ error: error.message })

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorResponder,
  authentication,
  errorResponsePicker,
}
