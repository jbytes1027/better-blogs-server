const app = require("./src/app")
const logger = require("./src/utils/logger")
const config = require("./src/utils/config")

app.listen(config.PORT, () => {
  logger.info(`Server started on port ${config.PORT}`)
})
