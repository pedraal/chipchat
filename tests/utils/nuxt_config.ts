import type { NuxtConfig } from 'nuxt/schema'
import type { MemoryDb } from './db'

interface TestNuxtConfigOptions {
  db?: MemoryDb
}

export async function testNuxtConfig(options: TestNuxtConfigOptions) {
  const config: NuxtConfig = {
    runtimeConfig: {},
  }

  if (options.db) {
    await options.db.connect()
    config.runtimeConfig!.mongoUrl = options.db.server!.getUri()
  }

  return config
}
