const loginWith = async (page, username, password) => {
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(username)
  await textboxes[1].fill(password)

  await page.getByRole('button', { name: 'Login' }).click()
}

const createWith = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(title)
  await textboxes[1].fill(author)
  await textboxes[2].fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  page.getByText(`a new blog ${title} by ${author} added`).waitFor()
}

export { loginWith, createWith }