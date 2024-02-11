// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxt/test-utils/module',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
  ],
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    mongoUrl: 'mongodb://localhost:27017/chipchat',
  },
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
