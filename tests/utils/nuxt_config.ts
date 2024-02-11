import {
  getPort,
} from 'get-port-please'
import type { NuxtConfig } from 'nuxt/schema'
import type { MemoryDb } from './db'

interface TestNuxtConfigOptions {
  noSocket?: boolean
  db?: MemoryDb
}

export async function testNuxtConfig(options: TestNuxtConfigOptions) {
  const socketPort = await getPort({ portRange: [4100, 4199] })

  const config: NuxtConfig = {
    nitro: {
      plugins: ['plugins/db.ts'],
    },
    runtimeConfig: {
      socketPort,
      public: {
        socketUrl: `http://localhost:${socketPort}`,
      },
    },
  }

  if (options.db) {
    await options.db.connect()
    config.runtimeConfig!.mongoUrl = options.db.server!.getUri()
  }

  if (!options.noSocket)
    config.nitro!.plugins!.push('plugins/socket.ts')

  return config
}
