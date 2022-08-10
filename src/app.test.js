const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("./app")
const User = require("./models/user")
const Post = require("./models/post")
const { JWT_SECRET } = require("./utils/config")

const api = supertest(app)

const validUsername = "user1"
const validPassword = "123456"
let token

beforeAll(async () => {
  await User.deleteMany({})
  await Post.deleteMany({})
}, 10000)

describe("end to end", () => {
  let userId

  describe("user crud", () => {
    test("create user", async () => {
      const res = await api
        .post("/api/users")
        .send({ username: validUsername, password: validPassword })

      userId = res.body.id
      expect(res.status).toBe(201)
    })

    test("create duplicate user", async () => {
      const res = await api
        .post("/api/users")
        .send({ username: validUsername, password: validPassword })

      expect(res.status).toBe(409)
    })

    test("user fetch", async () => {
      const res = await api.get(`/api/users/${userId}`)

      expect(res.status).toBe(200)
    })

    test("user fetch invalid id", async () => {
      const res = await api.get(`/api/users/jka3;l`)

      expect(res.status).toBe(404)
    })

    test("users fetch", async () => {
      const res = await api.get(`/api/users/`)

      expect(res.status).toBe(200)
    })
  })

  describe("authentication", () => {
    test("login", async () => {
      const res = await api
        .post("/api/login")
        .send({ username: validUsername, password: validPassword })

      expect(jwt.verify(res.body.token, JWT_SECRET)).toBeDefined()
      token = res.body.token
    })

    test("invalid password", async () => {
      const res = await api
        .post("/api/login")
        .send({ username: validUsername, password: "wrong" })

      expect(res.status).toBe(401)
    })

    test("invalid username", async () => {
      const res = await api
        .post("/api/login")
        .send({ username: "user0", password: validPassword })

      expect(res.status).toBe(401)
    })
  })

  describe("post crud", () => {
    let createdPostId

    const newPost = {
      title: "test wars",
      author: "Robert C. Martin",
      url: "http://post.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    test("post creation", async () => {
      const res = await api
        .post("/api/posts/")
        .set("Authorization", `bearer ${token}`)
        .send(newPost)

      createdPostId = res.body.id
      expect(res.status).toBe(201)
    })

    test("post creation invalid format", async () => {
      const res = await api
        .post("/api/posts/")
        .set("Authorization", `bearer ${token}`)
        .send({ "aljdfklsa;": "ajf" })

      expect(res.status).toBe(400)
    })

    test("post creation invalid token", async () => {
      const res = await api
        .post("/api/posts/")
        .set("Authorization", `bearer asdfjkl;`)
        .send(newPost)

      expect(res.status).toBe(401)
    })

    test("post fetching", async () => {
      const res = await api.get(`/api/posts/${createdPostId}`)

      expect(res.status).toBe(200)
    })

    test("post fetching invalid id", async () => {
      const res = await api.get(`/api/posts/asdfjkl`)

      expect(res.status).toBe(404)
    })

    test("post update", async () => {
      const update = {
        title: "updated title",
      }

      const updated = await api
        .put(`/api/posts/${createdPostId}`)
        .set("Authorization", `bearer ${token}`)
        .send(update)

      expect(updated.body.title).toBe("updated title")
    })

    test("post comment", async () => {
      const comment = { message: "comment test" }

      const res = await api
        .post(`/api/posts/${createdPostId}/comments`)
        .set("Authorization", `bearer ${token}`)
        .send(comment)

      expect(res.statusCode).toBe(200)
    })

    test("post deletion invalid authentication", async () => {
      const res = await api.delete(`/api/posts/${createdPostId}`)

      expect(res.status).toBe(401)
    })

    test("post deletion", async () => {
      const res = await api
        .delete(`/api/posts/${createdPostId}`)
        .set("Authorization", `bearer ${token}`)

      expect(res.status).toBe(204)
    })

    test("post deletion invalid id", async () => {
      const res = await api.delete(`/api/posts/kjla;s`)

      expect(res.status).toBe(404)
    })
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
