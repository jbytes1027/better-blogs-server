const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Post = require("../models/post")

const api = supertest(app)

beforeAll(async () => {
  await Post.deleteMany({})
})

test("get posts", async () => {
  const response = await api.get("/api/posts")

  expect(response.body.length).toBe(1)
})

test("new post", async () => {
  const newPost = {
    title: "test wars",
    author: "Robert C. Martin",
    url: "http://post.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }

  const beforePost = await api.get("/api/posts")

  await api
    .post("/api/posts")
    .send(newPost)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const afterPost = await api.get("/api/posts")

  expect(beforePost.body.length).toBe(afterPost.body.length - 1)
})

afterAll(() => {
  mongoose.connection.close()
})
