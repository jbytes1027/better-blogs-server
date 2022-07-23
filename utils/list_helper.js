const totalLikes = (posts) => posts.reduce((prev, post) => prev + post.likes, 0)

const mostLiked = (posts) => {
  let mostLiked
  for (const post of posts) {
    if (mostLiked === undefined || post.likes > mostLiked.likes) {
      mostLiked = post
    }
  }
  return mostLiked
}

module.exports = {
  totalLikes,
  mostLiked,
}
