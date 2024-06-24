const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs);
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if(blog){
    response.json(blog);
  }
  else{
    response.status(404).end();
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user;

  if(!user){
    return response.status(401).json({error: 'invalid token'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,  
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })
  if(blog.title === undefined || blog.url === undefined){
    return response.status(400).json({error: 'title missing'});
  }
  else{
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {  
  const user = request.user;

  if(!user){
    return response.status(401).json({error: 'invalid token'})
  }

  const blog = await Blog.findById(request.params.id);
  if(blog.user._id.toString() === user._id.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()    
  } else{
    return response.status(401).json({error: 'unauthorized user'})
  }
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter;