import { beforeEach, describe, expect, it } from 'vitest'
import { $fetch, createPage, setup } from '@nuxt/test-utils/e2e'
import { consola } from 'consola'
import { $fetchToDom } from '../utils/dom'

await setup({})
beforeEach(() => {
  consola.restoreConsole()
})

describe('app', async () => {
  it('has nav items', async () => {
    const document = await $fetchToDom('/')
    expect(document.querySelectorAll('nav .nav-item').length).toBe(2)
    expect(document.querySelector('nav button[data-testid="color-mode-button"]')).not.toBeNull()
    expect(document.querySelector('nav a[href="https://github.com/pedraal/chipchat"]')).not.toBeNull()
  })

  it('color mode', async () => {
    const page = await createPage('/')
    expect(page.locator('html').getAttribute('class')).resolves.toEqual('light')
    await page.getByTestId('color-mode-button').click()
    expect(page.locator('html').getAttribute('class')).resolves.toEqual('dark')
  })
})
