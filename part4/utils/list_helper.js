const _ = require('lodash')

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

const mostBlogs = (blogs) => {
    const blogsAuthor = blogs.map(blogs => blogs.author)
	
	let mode = 
		_.chain(blogsAuthor)
			.countBy()
			.entries()
			.maxBy(_.last)
			.thru(_.head)
			.value();

	let count = 0;

	blogsAuthor.forEach(element => {
  		if (element === mode) {
    	count += 1;
		}
	})
	
	return {
		author: mode,
		blogs: count,
	}
}

const mostLikes = (blogs) => {
	const groupedBlogs = _.groupBy(blogs, 'author')
	const countedAuthors = _.map(groupedBlogs, (arr) => { 
		return { 
			author: arr[0].author, 
			likes: _.sumBy(arr, 'likes'), 
		}; 
		
	})
	const maxLikesAuthor = _.maxBy(countedAuthors, (a) => a.likes)
	const authorName = _.head(_.values(maxLikesAuthor))

	return {
		author: authorName,
		likes: maxLikesAuthor.likes
	}
}
  
  module.exports = {
    dummy
    , totalLikes
    , favoriteBlog
    , mostBlogs
    , mostLikes
  }