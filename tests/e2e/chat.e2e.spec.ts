import type * as Playwright from 'playwright-core'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { consola } from 'consola'
import { testNuxtConfig } from '../utils/nuxt_config'
import { MemoryDb } from '../utils/db'
import { type UserModel, UserRepository } from '~/db/repositories/user.repo'
import { ChatRoomRepository } from '~/db/repositories/chatroom.repo'
import { MessageRepository } from '~/db/repositories/message.repo'

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

describe('chat', () => {
  describe('join', () => {
    it('should create a chatroom', async () => {
      const { page, user } = await loginAs('test', 'test')
      const chatRoomRepo = new ChatRoomRepository()
      await page.getByLabel('Room name').type('test room')
      await page.getByTestId('submit').click()
      await page.waitForURL('**/chats/test-room')
      await expect(page.locator('h1').textContent()).resolves.toContain('test room')
      expect(chatRoomRepo.collection.findOne({ name: 'test room' })).resolves.toMatchObject({
        name: 'test room',
        slug: 'test-room',
        adminId: user.id,
      })
    })

    it('should prevent joining a chatroom if the user is banned', async () => {
      const { page, user } = await loginAs('test', 'test')
      const chatRoomRepo = new ChatRoomRepository()
      const chatRoom = await chatRoomRepo.create(user.id, { name: 'test', slug: 'test' })
      chatRoomRepo.collection.updateOne({ _id: chatRoom._id }, { $push: { bannedUserIds: user.id } })
      await page.getByLabel('Room name').type('test')
      await page.getByTestId('submit').click()
      await expect(page.getByTestId('roomName-error').textContent()).resolves.toContain('You have been banned from this room')
    })
  })

  describe('messages', async () => {
    it('should send and receive messages', async () => {
      const { page: page1, user: user1 } = await loginAs('test1', 'test')
      const { page: page2, user: user2 } = await loginAs('test2', 'test')
      await joinRoom(page1, user1)
      await joinRoom(page2, user2)
      await page1.getByPlaceholder('Type your message here').type('hello')
      await page1.getByTestId('submit').click()
      await expect(page1.getByTestId('message-user').textContent()).resolves.toContain('test1')
      await expect(page1.getByTestId('message-content').textContent()).resolves.toContain('hello')
      await expect(page2.getByTestId('message-content').textContent()).resolves.toContain('hello')
    })

    it('should get the 10 latest messages on join', async () => {
      const userRepo = new UserRepository()
      const user = await userRepo.create({ username: 'test1', password: 'test' })
      const chatRoomRepo = new ChatRoomRepository()
      const chatRoom = await chatRoomRepo.findOrCreateOne(user.id, 'test')
      const messageRepo = new MessageRepository()
      for (let i = 0; i < 15; i++)
        await messageRepo.create(user, chatRoom.id, { content: `message ${i}` })

      const { page, user: user2 } = await loginAs('test2', 'test')
      await joinRoom(page, user2)
      await expect(page.getByTestId('message').count()).resolves.toBe(10)
    })
  })

  describe('ban', () => {
    it('should ban a user', async () => {
      const { page: page1, user: user1 } = await loginAs('test1', 'test')
      const { page: page2, user: user2 } = await loginAs('test2', 'test')
      await joinRoom(page1, user1)
      await joinRoom(page2, user2)

      await page1.getByTestId(`test2-tag`).click()
      await page1.getByTestId('ban-button').click()
      // wait for ban button to not be visible
      await page1.waitForSelector('[data-testid="ban-button"]', { state: 'detached' })
      await expect(page1.getByTestId('connected-users').getByTestId('test2-tag').count()).resolves.toBe(0)
      await expect(page2.getByTestId('roomName-error').textContent()).resolves.toContain('You have been banned from test')
    })
  })
})

async function loginAs(username: string, password: string) {
  const userRepo = new UserRepository()
  const user = await userRepo.create({ username, password })
  const page = await createPage('/login')
  await expect(page.locator('h1').textContent()).resolves.toContain('Login')
  await page.getByLabel('Username').type(username)
  await page.getByLabel('Password').type(password)
  await page.getByTestId('submit').click()

  return { page, user }
}

async function joinRoom(page: Playwright.Page, user: UserModel, roomName = 'test') {
  const chatRoomRepo = new ChatRoomRepository()
  const chatRoom = await chatRoomRepo.findOrCreateOne(user.id, roomName)
  const url = new URL(page.url())
  await page.goto(`${url.origin}/chats/${chatRoom.slug}`)
  await expect(page.locator('h1').textContent()).resolves.toContain(roomName)
}
