import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'
import { expect as expectE2E } from '@playwright/test'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { consola } from 'consola'
import { testNuxtConfig } from '../utils/nuxt_config'
import { MemoryDb } from '../utils/db'
import { UserRepository } from '~/db/repositories/user.repo'
import { DbClient } from '~/db/client'

const db = new MemoryDb()

beforeEach(() => {
  consola.restoreConsole()
})

afterEach(async () => {
  await DbClient.db.dropDatabase()
})

afterAll(async () => {
  await db.disconnect()
})

await setup({
  nuxtConfig: await testNuxtConfig({ db }),
})

describe('auth', async () => {
  describe('login', () => {
    it('should show error if invalid', async () => {
      const page = await createPage('/')
      await page.getByTestId('login-link').click()
      await page.waitForURL('**/login')
      await expect(page.locator('h1').textContent()).resolves.toContain('Login')
      await page.getByLabel('Username').type('test')
      await page.getByLabel('Password').type('test')
      await page.getByTestId('submit').click()
      await expectE2E(page.getByText('Invalid username or password')).toBeVisible()
    })

    it('should auth and navigate to chats if valid', async () => {
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
      await expectE2E(page.getByText('Its time to join or create a chat room !')).toBeVisible()
    })
  })

  describe('signup', () => {
    it('should show error if invalid', async () => {
      const repo = new UserRepository()
      await repo.create({ username: 'test', password: 'test' })
      const page = await createPage('/')
      await page.getByTestId('login-link').click()
      await page.getByTestId('signup-link').click()
      await page.waitForURL('**/signup')
      await expect(page.locator('h1').textContent()).resolves.toContain('Signup')
      await page.getByLabel('Username').type('t')
      await page.getByLabel('Password', { exact: true }).type('t')
      await page.getByTestId('submit').click()
      await expectE2E(page.getByText('Passwords don\'t match')).toBeVisible()
      await expect(page.getByText('Must be longer than 3 characters').count()).resolves.toBe(2)
      await page.getByLabel('Username').clear()
      await page.getByLabel('Username').type('test')
      await page.getByLabel('Password', { exact: true }).clear()
      await page.getByLabel('Password', { exact: true }).type('test')
      await page.getByLabel('Password confirmation').clear()
      await page.getByLabel('Password confirmation').type('test')
      await page.getByTestId('submit').click()
      await expectE2E(page.getByText('Username already taken')).toBeVisible()
    })

    it('should auth and navigate to chats if valid', async () => {
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
      await expectE2E(page.getByText('Its time to join or create a chat room !')).toBeVisible()
      await expect(repo.collection.findOne({ username: 'test' })).resolves.toMatchObject({ username: 'test' })
    })
  })
})
