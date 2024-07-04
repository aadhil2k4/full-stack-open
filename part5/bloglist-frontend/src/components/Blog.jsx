import { useState } from 'react'

const Blog = ({ blog, addLikes, removeBlog, user }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    addLikes(blog.id, blogObject)
  }

  const handleDelete = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      removeBlog(blog.id)
    }
  }

  const showDelete = blog.user.id === user.id ? true : false
  console.log(blog.user.id, user.id, showDelete)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='blogDetails'>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='blogFullDetails'>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>hide</button><br />
        {blog.url}<br />
        likes {blog.likes} <button onClick={handleLike}>likes</button> <br />
        {blog.user.name} <br />
        {showDelete && <button onClick={handleDelete}>remove</button>}
      </div>
    </div>
  )}

export default Blog