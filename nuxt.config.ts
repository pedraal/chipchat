// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
    socketPort: 4000,
    origin: 'http://localhost:3000',
    public: {
      socketUrl: 'http://localhost:4000',
    },
  },
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
