class RequestError extends Error {
  constructor(message = "Error", statusCode = 400) {
    super()
    this.message = message
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}

class DuplicateResourceError extends RequestError {
  constructor() {
    super("Resource already exists", 409)
  }
}

class AuthenticationError extends RequestError {
  constructor(message) {
    super(message, 401)
  }
}

module.exports = {
  DuplicateResourceError,
  AuthenticationError,
  RequestError,
}
