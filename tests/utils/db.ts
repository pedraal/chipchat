import { MongoMemoryServer } from 'mongodb-memory-server'
import { DbClient } from '../../db/client'

export class MemoryDb {
  server?: MongoMemoryServer
  async connect() {
    this.server = await MongoMemoryServer.create()
    await DbClient.connect(this.server.getUri())
  }

  async disconnect() {
    if (!this.server)
      return
    await this.server.stop()
  }

  async clear() {
    await DbClient.db.dropDatabase()
  }
}
