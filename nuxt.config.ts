// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxt/test-utils/module',
    'nuxt-auth-utils',
  ],
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    mongoUrl: 'mongodb://localhost:27017/chipchat',
  },
})
