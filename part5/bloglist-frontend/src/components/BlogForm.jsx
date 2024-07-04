import React, { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
    }
    addBlog(newBlog)
    setNewTitle('')
    setNewAuthor('')
    setNewURL('')
  }

  return (
    <div className='formDiv'>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type="text"
            value={newTitle}
            name="newTitle"
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder='write title here...'
          />
          <br />
          author:
          <input
            type="text"
            value={newAuthor}
            name="newAuthor"
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder='write author here...'
          />
          <br />
          url:
          <input
            type="text"
            value={newURL}
            name="newURL"
            onChange={({ target }) => setNewURL(target.value)}
            placeholder='write url here...'
          />
          <br />
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
