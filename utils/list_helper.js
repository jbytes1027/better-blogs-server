const totalLikes = (blogs) => (
  sum = blogs.reduce((prev, blog) => (
    prev + blog.likes
  ), 0)
)

module.exports = {
  dummy, totalLikes
}
