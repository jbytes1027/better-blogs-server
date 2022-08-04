const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  comments: {
    type: [String],
    required: true,
  }
})

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Post", postSchema)
