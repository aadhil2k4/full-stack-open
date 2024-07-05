const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'aadhil2k4',
        name: 'Aadhil Ahamed',
        password: 'aadhil123',
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    //await textboxes[0].fill('aadhil2k4')
    //await textboxes[1].fill('aadhil123')
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()

    //await expect(page.getByText('aadhil2k4 logged in')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      /*const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('aadhil2k4')
      await textboxes[1].fill('aadhil123')

      await page.getByRole('button', { name: 'Login' }).click()*/
      await loginWith(page, 'aadhil2k4', 'aadhil123')
      await expect(page.getByText('aadhil2k4 logged in')).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {
      /*const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('aadhil2k4')
      await textboxes[1].fill('aadhil')

      await page.getByRole('button', { name: 'Login' }).click()*/
      await loginWith(page, 'aadhil2k4', 'aadhil')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'aadhil2k4', 'aadhil123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createWith(page, 'test title', 'test author', 'test url')
      await expect(
        page.getByText('a new blog test title by test author added')
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'create' })
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
      const blogEntry = page.locator('.blog').filter({
        hasText: 'test title - test author'
      })
      await expect(blogEntry).toBeVisible()
    })

    describe('And several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createWith(page, 'test-1', 'test author', 'http://localhost:5173')
        await createWith(page, 'test-2', 'test author', 'http://localhost:5173')
        //await createWith(page, 'test-3', 'test author', 'http://localhost:5173')
      })

      test('user can like a blog', async ({ page }) => {
        //await createWith(page, 'test title(1)', 'test author', 'test url')
        const blogDiv = page.locator('.blog')
        const matchingEntry = blogDiv.filter({
          hasText: 'test-1 - test author'
        })
        await matchingEntry.getByRole('button', { name: 'view' }).click()
        await matchingEntry.getByRole('button', { name: 'likes' }).click()
        await expect(matchingEntry).toContainText('likes 1')
      })

      test('user who added the blog can delete it', async ({ page }) => {
        const blogDiv = page.locator('.blog').filter({
          hasText: 'test-1 - test author'
        })
        await blogDiv.getByRole('button', { name: 'view' }).click()
        //await blogDiv.getByRole('button', { name: 'remove' }).click()
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'remove' }).click()
        //await expect(blogDiv.getByText('test title - test author')).not.toBeVisible()
        await expect(blogDiv).not.toBeVisible()
      })

      test('only the user who added the blog sees the remove button', async ({ page, request }) => {
        createWith(page, 'test title', 'test author', 'test url')
        const blogDiv = page.locator('.blog').filter({
          hasText: 'test-1 - test author'
        })
        await blogDiv.getByRole('button', { name: 'view' }).click()
        await expect(blogDiv.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await request.post('http://localhost:3003/api/users', {
          data: {
            username: 'test',
            name: 'Test_user',
            password: 'test'
          }
        })
        await loginWith(page, 'test', 'test')
        await blogDiv.getByRole('button', { name: 'view' }).click()
        await expect(blogDiv.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are arranged according to likes', async ({ page }) => {
        const blogDiv1 = page.locator('.blog').filter({
          hasText: 'test-1 - test author'
        })
        const blogDiv2 = page.locator('.blog').filter({
          hasText: 'test-2 - test author'
        })
        const blogDiv3 = page.locator('.blog').filter({
          hasText: 'test-3 - test author'
        })

        await blogDiv1.getByRole('button', { name: 'view' }).click()
        await blogDiv2.getByRole('button', { name: 'view' }).click()
        await blogDiv3.getByRole('button', { name: 'view' }).click()

        await blogDiv1.getByRole('button', { name: 'like' }).click()
        await blogDiv2.getByRole('button', { name: 'like' }).click()
        await blogDiv3.getByRole('button', { name: 'like' }).click()
        await blogDiv2.getByRole('button', { name: 'like' }).click()
        await blogDiv2.getByRole('button', { name: 'like' }).click()

        const blogEntries = page.locator('.blog')
        await expect(blogEntries.nth(0)).toContainText('test-2 - test author') 
        await expect(blogEntries.nth(1)).toContainText('test-3 - test author') 
        await expect(blogEntries.nth(2)).toContainText('test-1 - test author') 
      })
    })
  })
})