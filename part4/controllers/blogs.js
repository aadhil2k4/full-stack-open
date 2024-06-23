const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
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

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,  
    likes: body.likes === undefined ? 0 : body.likes,
  })
  if(blog.title === undefined || blog.url === undefined){
    return response.status(400).json({error: 'title missing'});
  }
  else{
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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

module.exports = blogsRouter