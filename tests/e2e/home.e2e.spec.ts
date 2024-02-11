import { beforeEach, describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils/e2e'
import { consola } from 'consola'
import { $fetchToDom } from '../utils/dom'
import { testNuxtConfig } from '../utils/nuxt_config'

await setup({
  nuxtConfig: await testNuxtConfig({ }),
})

beforeEach(() => {
  consola.restoreConsole()
})

describe('home', async () => {
  it('content', async () => {
    const document = await $fetchToDom('/')
    expect(document.querySelector('h1')?.textContent).toContain('ChipChat')
    expect(document.querySelector('a[data-testid="login-link"]')).not.toBeNull()
  })
})
