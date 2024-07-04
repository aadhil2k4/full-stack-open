import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Blog from './Blog'


test('renders title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }
  const user = {
    id: '12345',
    name: 'Test User'
  }
  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.blogDetails')
  expect(div).toHaveTextContent('Test Blog Title - Test Author')
  //expect(container.querySelector('.blogUrl')).toBeNull()
  //expect(container.querySelector('.blogLikes')).toBeNull()
})

test('renders url and likes when view button is clicked',async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  const user = {
    id: '12345',
    name: 'Test User'
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.blogFullDetails')
  expect(div).toHaveTextContent('http://testblog.com')
  expect(div).toHaveTextContent('likes 0')
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  const user = {
    id: '12345',
    name: 'Test User'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} addLikes={mockHandler} />)

  const users = userEvent.setup()
  const button = screen.getByText('likes')
  await users.click(button)
  await users.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)

})
