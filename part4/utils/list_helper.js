const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) =>{
        return sum + item
    }

    const blogLikes = blogs.map(blog => blog.likes)

    return blogLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const blogLikes = blogs.map(blog => blog.likes)
    const maxLikes = Math.max(...blogLikes)
    const largestIndex = blogs.find(blog => blog.likes === maxLikes)
    return {
        title: largestIndex.title,
        author: largestIndex.author,
        likes: largestIndex.likes
    }
}
  
  module.exports = {
    dummy
    , totalLikes
    , favoriteBlog
  }