const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.post('/', async(request, response, next) => {
    const body = request.body;
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
})

blogsRouter.get('/:id', async(request, response, next) => {
        const blog = await Blog.findById(request.params.id);
        if(blog){
            response.json(blog);
        }
        else{
            response.status(404).end();
        }
})

blogsRouter.delete('/:id', async(request, response, next) => {
        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).end();
})

module.exports = blogsRouter;