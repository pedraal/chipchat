import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { consola } from 'consola'
import { UserRepository } from '~/db/repositories/user'
import { MemoryDb } from '~/tests/utils/db'

const db = new MemoryDb()
beforeAll(async () => {
  await db.connect()
})

afterAll(async () => {
  await db.disconnect()
})

beforeEach(() => {
  consola.restoreConsole()
})

afterEach(async () => {
  await db.clear()
})

describe('user repository', () => {
  describe('create', () => {
    it('should resolve if valid', async () => {
      const repo = new UserRepository()
      expect(repo.create({ username: 'test', password: 'test' })).resolves.toMatchObject({
        username: 'test',
        password: expect.any(String),
        id: expect.any(String),
        _id: expect.any(Object),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })

      const user = await repo.collection.findOne({ username: 'test' })
      expect(user).toBeDefined()
      expect(user?.password).not.toBe('test')
    })

    it('should reject if invalid', async () => {
      const repo = new UserRepository()
      await repo.create({ username: 'foobar', password: 'test' })
      await expect(repo.create({ username: 'foobar', password: 'test' })).rejects.toThrowError('Username already taken')
      await expect(repo.create({ username: 't', password: 'test' })).rejects.toThrowError('Must be longer than 3 characters')
      await expect(repo.create({ username: 'test', password: 't' })).rejects.toThrowError('Must be longer than 3 characters')
      const longString = Array.from({ length: 21 }).fill('t').join('')
      await expect(repo.create({ username: longString, password: 'test' })).rejects.toThrowError('Must be shorter than 20 characters')
      await expect(repo.create({ username: 'test', password: longString })).rejects.toThrowError('Must be shorter than 20 characters')
    })
  })

  describe('authenticate', () => {
    it('should resolve if password matches', async () => {
      const repo = new UserRepository()
      await repo.create({ username: 'foobar', password: 'test' })
      await expect(repo.authenticate({ username: 'foobar', password: 'test' })).resolves.toMatchObject({
        username: 'foobar',
        password: expect.any(String),
      })
    })

    it('should reject if password does not match', async () => {
      const repo = new UserRepository()
      await repo.create({ username: 'foobar', password: 'test' })
      await expect(repo.authenticate({ username: 'foobar', password: 'testy' })).rejects.toThrowError('Invalid username or password')
    })
  })

  describe('findMany', () => {
    it('should resolve with users', async () => {
      const repo = new UserRepository()
      const ids = []
      for (let i = 0; i < 10; i++) {
        const user = await repo.create({ username: `user${i}`, password: `password${i}` })
        ids.push(user.id)
      }
      const users = await repo.findMany(ids)
      expect(users).toHaveLength(10)
      expect(users[0].username).toBe('user0')
      expect((users[0] as any).password).not.toBeDefined()
    })
  })
})
