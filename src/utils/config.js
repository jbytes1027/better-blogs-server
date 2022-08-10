require("dotenv").config()

const PORT = process.env.PORT || 80
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
}
