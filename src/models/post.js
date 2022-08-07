const mongoose = require("mongoose")
const User = require("./user")

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async (u) => {
        return await User.exists({ _id: u })
      },
      message: "not found",
    },
  },
  comments: {
    type: [String],
    required: true,
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
