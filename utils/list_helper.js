const totalLikes = (blogs) => (
  sum = blogs.reduce((prev, blog) => (
    prev + blog.likes
  ), 0)
)

const mostLiked = (blogs) => {
  let mostLiked
  for (const blog of blogs) {
    if (mostLiked === undefined || blog.likes > mostLiked.likes) {
      mostLiked = blog
    }
  }
  return mostLiked
}

module.exports = {
  totalLikes, mostLiked
}
