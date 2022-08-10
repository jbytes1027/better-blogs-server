require("express-async-errors")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRouter = require("./controllers/users")
const postRouter = require("./controllers/posts")
const loginRouter = require("./controllers/login")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const config = require("./utils/config")

const app = express()

console.log(process.env)
console.log(process.env.MONGODB_URI_TEST)
console.log(process.env.JWT_SECRET)
logger.info("Connecting to", config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch(() => logger.error("Error connecting to MongoDB"))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/users/", userRouter)
app.use("/api/posts/", postRouter)
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorResponsePicker)
app.use(middleware.errorResponder)

module.exports = app
