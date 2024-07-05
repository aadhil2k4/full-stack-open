import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [errorType, setErrorType] = useState(0)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('Retrieved user from localStorage:', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      console.log('Logged in user:', user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setError('Wrong username or password')
      setErrorType(0)
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
    console.log('logging in with', username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      const updatedBlog = await blogService.getAll()
      setBlogs(updatedBlog)
      setError(`a new blog ${savedBlog.title} by ${savedBlog.author} added`)
      setErrorType(1)
      setTimeout(() => {
        setError(null)
      }, 3000)
      // Hide the blog form and show the "create new blog" button
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setError('Error adding blog')
      setErrorType(0)
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  const addLikes = async(id, blogObject) => {
    await blogService.update(id, blogObject)
    const updatedBlog = await blogService.getAll()
    setBlogs(updatedBlog)
  }

  const removeBlog = async(id) => {
    await blogService.remove(id)
    const updatedBlog = await blogService.getAll()
    setBlogs(updatedBlog)
  }

  const sortLikes = (a, b) => b.likes - a.likes

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={error} type={errorType} />
        <form onSubmit={handleLogin}>
          <div>
            UserName
            <input
              type="text"
              id="username"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              value={password}
              id="password"
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={error} type={errorType} />
      {user.username} logged in <button onClick={handleLogout}>logout</button>
      <div>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm addBlog={addBlog} />
        </Togglable>
      </div>
      <div style={{ marginTop:'10px' }}>
        {blogs.sort(sortLikes).map((blog) => (
          <Blog key={blog.id} blog={blog} addLikes={addLikes} removeBlog={removeBlog} user={user}/>
        ))}
      </div>
    </div>
  )
}

export default App
