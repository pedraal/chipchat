import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    coverage: {
      reporter: ['text', 'html', 'json', 'json-summary', 'cobertura'],
    },
  },
})
