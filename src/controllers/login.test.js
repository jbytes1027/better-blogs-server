const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const User = require("../models/user")

const api = supertest(app)

const username = "user1"
const password = "123456"

beforeAll(async () => {
  await User.deleteMany({})

  await api.post("/api/users").send({ username, password })
})

test("token valid", async () => {
  const res = await api.post("/api/login").send({ username, password })

  expect(res.status).toEqual(200)
  expect(jwt.verify(res.body.token, process.env.SECRET)).toBeDefined()
})

test("invalid password", async () => {
  const res = await api.post("/api/login").send({ username, password: "wrong" })

  expect(res.status).toEqual(401)
})

test("invalid username", async () => {
  const res = await api.post("/api/login").send({ username: "user0", password })

  expect(res.status).toEqual(401)
})

afterAll(() => {
  mongoose.connection.close()
})
