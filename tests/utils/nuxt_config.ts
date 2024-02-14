import type { NuxtConfig } from 'nuxt/schema'
import { TestDb } from './db'

export async function testNuxtConfig(): Promise<NuxtConfig> {
  await TestDb.connect()

  return {
    runtimeConfig: {
      mongoUrl: TestDb.url,
    },
  }
}
