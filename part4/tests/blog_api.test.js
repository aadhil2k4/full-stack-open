const { test, after, beforeEach, describe } = require("node:test");
const Blog = require("../models/blogs");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const assert = require("node:assert");
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }
  });

  /*test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})*/

  test("returns correct amount of blog posts in json format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("unique identifier property of blog post is _id", async () => {
    const blogAtStart = await helper.blogsInDb();
    const blogToView = blogAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(resultBlog.body.id, blogToView.id);
  });

  describe("viewing a specific blog", () => {
    test("a valid blog can be added by a authorized user", async () => {
      const newBlog = {
        title: "ML is the future",
        author: "Andrew Ng",
        url: "https://www.coursera.org/",
        likes: 10,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((r) => r.title);
      assert(titles.includes("ML is the future"));
    });

    test("if likes property is missing, it will default to 0", async () => {
      const newBlog = {
        title: "ML is the future",
        author: "Andrew Ng",
        url: "https://www.coursera.org/",
      };
      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const resultBlog = blogsAtEnd.find(
        (blog) => blog.title === "ML is the future"
      );
      assert.strictEqual(resultBlog.likes, 0);
    });

    test("blog without title/url is not added", async () => {
      const newBlog = {
        author: "None",
        likes: 0,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogAtStart = await helper.blogsInDb();
        const blogToDelete = blogAtStart[0];
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

        const titles = blogsAtEnd.map(r => r.title);
        assert(!titles.includes(blogToDelete.title));
    })
  })

  describe('updating a blog', () => {
    test('likes of a blog is updated', async () => {
        const blogAtStart = await helper.blogsInDb();
        const blogToUpdate = blogAtStart[0];
        const updatedBlog = { ...blogToUpdate, likes: 1000 };
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

        const initialLikes = blogAtStart.map(r => r.likes);
        const updatedLikes = blogsAtEnd.map(r => r.likes);
        assert(!initialLikes.includes(updatedLikes));
    })
  })
});

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected username to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
  await mongoose.connection.close();
});
