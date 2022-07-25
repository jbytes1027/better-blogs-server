const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  time: String,
  user: {
    type: mongoose.ObjectId,
    ref: "User",
  },
})

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Post", postSchema)