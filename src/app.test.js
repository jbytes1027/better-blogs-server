const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("./app")
const User = require("./models/user")
const Post = require("./models/post")

const api = supertest(app)

const validUsername = "user1"
const validPassword = "123456"
let token

beforeAll(async () => {
  await User.deleteMany({})
  await Post.deleteMany({})
})

describe("end to end", () => {
  test("create user", async () => {
    const res = await api
      .post("/api/users")
      .send({ username: validUsername, password: validPassword })

    expect(res.status).toBe(201)
  })

  test("create duplicate user", async () => {
    const res = await api
      .post("/api/users")
      .send({ username: validUsername, password: validPassword })

    expect(res.status).toBe(409)
  })

  describe("authentication", () => {
    test("login", async () => {
      const res = await api
        .post("/api/login")
        .send({ username: validUsername, password: validPassword })

      expect(res.status).toBe(200)
      expect(jwt.verify(res.body.token, process.env.SECRET)).toBeDefined()
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

      expect(res.status).toBe(201)
      expect(res.body.id).toBeDefined()
      createdPostId = res.body.id
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
        .set("Authentication", `bearer asdfklj;a`)
        .send({})

      expect(res.status).toBe(401)
    })

    test("post fetching", async () => {
      const res = await api.get(`/api/posts/${createdPostId}`)

      expect(res.status).toBe(200)
      expect(res.body.title).toBeDefined()
    })

    test("post fetching invalid id", async () => {
      const res = await api.get(`/api/posts/asdfjkl`)

      expect(res.status).toBe(404)
    })

    test("post deletion", async () => {
      const res = await api.delete(`/api/posts/${createdPostId}`)

      expect(res.status).toBe(204)
    })

    test("post deletion invalid id", async () => {
      const res = await api.delete(`/api/posts/kjla;s`)

      expect(res.status).toBe(404)
    })

    test.todo("post update partial")
    test.todo("post update wrong user")
    test.todo("post update invalid format")
    test.todo("post comment")
    test.todo("post comment invalid id")
    test.todo("post comment invalid format")
  })
  test.todo("user crud")

  afterAll(() => {
    mongoose.connection.close()
  })
})
