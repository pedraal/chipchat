import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environmentOptions: {
      nuxt: {
        overrides: {
          runtimeConfig: {
            // @ts-expect-error block socket server
            socketPort: null,
            public: {
              // @ts-expect-error block socket client connection
              socketUrl: null,
            },
          },
        },
      },
    },
  },
  // any custom Vitest config you require
})
