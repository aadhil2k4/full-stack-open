const Blog = require('../models/blogs');

const initialBlogs = [
    {
        title: 'Math',
        author: 'Me',
        url: 'www.math.com',
        likes: 10
    },
    {
        title: 'CSE',
        author: 'Me',
        url: 'www.cse.com',
        likes: 11 
    }
]

const nonExistingId = async() => {
    const blog = new Blog({title: 'willremovethissoon', author: 'Me', url: 'www.willremovethissoon.com', likes: 0});
    await blog.save();
    await blog.deleteOne();
    return blog._id.toString();
}

const blogsInDb = async() => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}