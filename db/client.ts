import { MongoClient } from 'mongodb'

export class DbClient {
  static instance: DbClient

  static async connect(url: string) {
    this.instance = new this(url)
    await this.instance.connect()
  }

  static get db() {
    return this.instance.client.db()
  }

  static async waitConnection() {
    return this.instance.waitConnection()
  }

  client: MongoClient
  connected: boolean
  constructor(url: string) {
    this.client = new MongoClient(url)
    this.connected = false
  }

  async connect() {
    await this.client.connect()
    this.connected = true
  }

  async waitConnection() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (this.connected) resolve()
      }, 100)
    })
  }

  get db() {
    return this.client.db()
  }
}
