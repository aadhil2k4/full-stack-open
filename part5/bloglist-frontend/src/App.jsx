import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(0);
  const [user, setUser] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setError("Wrong username or password");
      setErrorType(0);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
    console.log("logging in with", username, password);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
    };

    try {
      const savedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(savedBlog));
      setNewTitle("");
      setNewAuthor("");
      setNewURL("");
      setError(`a new blog ${savedBlog.title} by ${savedBlog.author} added`);
      setErrorType(1);
      setTimeout(() => {
        setError(null);
      }, 5000);
    } catch (exception) {
      setError("Error adding blog");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

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
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={error} type={errorType} />
      {user.username} logged in <button onClick={handleLogout}>logout</button>
      <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
            title:
            <input
              type="text"
              value={newTitle}
              name="newTitle"
              onChange={({ target }) => setNewTitle(target.value)}
            />
            <br />
            author:
            <input
              type="text"
              value={newAuthor}
              name="newAuthor"
              onChange={({ target }) => setNewAuthor(target.value)}
            />
            <br />
            url:
            <input
              type="text"
              value={newURL}
              name="newURL"
              onChange={({ target }) => setNewURL(target.value)}
            />
            <br />
            <button type="submit">create</button>
          </div>
        </form>
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
