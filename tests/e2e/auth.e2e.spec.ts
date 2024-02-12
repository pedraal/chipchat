import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { consola } from 'consola'
import { testNuxtConfig } from '../utils/nuxt_config'
import { MemoryDb } from '../utils/db'
import { UserRepository } from '~/db/repositories/user.repo'

const db = new MemoryDb()

afterAll(async () => {
  await db.disconnect()
})

beforeEach(() => {
  consola.restoreConsole()
})

afterEach(async () => {
  await db.clear()
})

await setup({
  nuxtConfig: await testNuxtConfig({ db }),
})

describe('auth', () => {
  describe('login', () => {
    it('should show error if invalid', async () => {
      const page = await createPage('/')
      await page.getByTestId('login-link').click()
      await page.waitForURL('**/login')
      await expect(page.locator('h1').textContent()).resolves.toContain('Login')
      await page.getByLabel('Username').type('test')
      await page.getByLabel('Password').type('test')
      await page.getByTestId('submit').click()
      expect(page.getByText('Invalid username or password')).toBeDefined()
    })

    it('should redirect if valid', async () => {
      const repo = new UserRepository()
      await repo.create({ username: 'test', password: 'test' })
      const page = await createPage('/')
      await page.getByTestId('login-link').click()
      await page.waitForURL('**/login')
      await expect(page.locator('h1').textContent()).resolves.toContain('Login')
      await page.getByLabel('Username').type('test')
      await page.getByLabel('Password').type('test')
      await page.getByTestId('submit').click()
      await page.waitForURL('**/chats')
      await expect(page.locator('h1').textContent()).resolves.toContain('Its time to join or create a chat room !')
    })
  })

  describe('signup', () => {
    it('should show error if invalid', async () => {
      const page = await createPage('/')
      await page.getByTestId('login-link').click()
      await page.getByTestId('signup-link').click()
      await page.waitForURL('**/signup')
      await expect(page.locator('h1').textContent()).resolves.toContain('Signup')
      await page.getByLabel('Username').type('t')
      await page.getByLabel('Password', { exact: true }).type('test')
      await page.getByTestId('submit').click()
      expect(page.getByText('Passwords don\'t match')).toBeDefined()
      await page.getByLabel('Password confirmation').type('test')
      await page.getByTestId('submit').click()
      expect(page.getByText('Must be longer than 3 characters')).toBeDefined()
    })

    it('should redirect if valid', async () => {
      const repo = new UserRepository()
      const page = await createPage('/')
      await page.getByTestId('login-link').click()
      await page.getByTestId('signup-link').click()
      await page.waitForURL('**/signup')
      await expect(page.locator('h1').textContent()).resolves.toContain('Signup')
      await page.getByLabel('Username').type('test')
      await page.getByLabel('Password', { exact: true }).type('test')
      await page.getByLabel('Password confirmation').type('test')
      await page.getByTestId('submit').click()
      await page.waitForURL('**/chats')
      await expect(page.locator('h1').textContent()).resolves.toContain('Its time to join or create a chat room !')
      await expect(repo.collection.findOne({ username: 'test' })).resolves.toMatchObject({ username: 'test' })
    })
  })
})
