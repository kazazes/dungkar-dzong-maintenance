// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/ui'
  ],
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      adminPassword: process.env.ADMIN_PASSWORD
    }
  },
  app: {
    head: {
      script: []
    }
  },
  tailwindcss: {
    exposeConfig: true
  }
})
