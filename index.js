const http = require("http")
const app = require("./lib/app")
const logger = require("./lib/utils/logger")
const config = require("./lib/utils/config")

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server started on port ${config.PORT}`)
})
