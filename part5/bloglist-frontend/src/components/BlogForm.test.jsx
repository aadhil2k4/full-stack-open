import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('form calls event handler when a new blog is created',async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write title here...')
  const authorInput = screen.getByPlaceholderText('write author here...')
  const urlInput = screen.getByPlaceholderText('write url here...')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'title')
  await user.type(authorInput, 'author')
  await user.type(urlInput, 'www.url.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title')
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.url.com')

})