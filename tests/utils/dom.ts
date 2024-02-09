import { Window } from 'happy-dom'
import { $fetch, url as nuxtUrl } from '@nuxt/test-utils/e2e'

export async function $fetchToDom(url: string) {
  const html = await $fetch(url)
  const window = new Window({ url: nuxtUrl(url) })
  const document = window.document

  document.write(html)

  return document
}
