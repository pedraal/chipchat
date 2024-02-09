import { beforeEach, describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils/e2e'
import { consola } from 'consola'
import { $fetchToDom } from '../utils/dom'

beforeEach(() => {
  consola.restoreConsole()
})

await setup({})

describe('home', async () => {
  it('content', async () => {
    const document = await $fetchToDom('/')
    expect(document.querySelector('h1')?.textContent).toContain('ChipChat')
    expect(document.querySelector('a[data-testid="main-login"]')).not.toBeNull()
  })
})
