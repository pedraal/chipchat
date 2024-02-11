import type { NuxtConfig } from 'nuxt/schema'
import type { MemoryDb } from './db'

interface TestNuxtConfigOptions {
  noSocket?: boolean
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

  if (!options.noSocket)
    config.nitro!.plugins!.push('plugins/socket.ts')

  return config
}
