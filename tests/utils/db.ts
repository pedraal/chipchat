import { DbClient } from '../../db/client'

export class TestDb {
  // eslint-disable-next-line node/prefer-global/process
  static url = `mongodb://localhost:27017/test-${(process as any).__tinypool_state__.workerId}`

  static async connect() {
    await DbClient.connect(this.url)
  }

  static async disconnect() {
    await DbClient.disconnect()
  }

  static async clear() {
    await DbClient.db.dropDatabase()
  }
}
