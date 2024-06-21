const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const assert = require('node:assert')
const helper = require('./test_helper')
const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    for(let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test.only('users are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async() => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const contents = response.body.map(r => r.content);
    assert(contents.includes('Browser can execute only javascript'));
})

test('there are two blog posts', async() => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, initialBlogs.length);
})

test('unique identifier property is _id', async() => {
    const blogs = await Blog.find({});
    expect(blogs[0]._id).toBeDefined();
})

test('a valid blog can be added', async() => {
    const newBlog = {
        title: 'Music',
        author: 'Me',
        url: 'www.music.com',
        likes: 1
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map(r => r.title);
    assert(titles.includes('Music'));
})

test('blog without title is not added', async() => {
    const newBlog = {
        author: 'Me',
        url: 'www.music.com',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await helper.blogsInDb();
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
})

test('a specific blog can be viewed', async() => {
    const blogAtStart = await helper.blogsInDb();
    const blogToView = blogAtStart[0];
    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be deleted', async() => {
    const blogAtStart = await helper.blogsInDb();
    const blogToDelete = blogAtStart[0];
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map(r => r.title);
    assert(!titles.includes(blogToDelete.title));
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
})

after(async () => {
    await mongoose.connection.close()
})
