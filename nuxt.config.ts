// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/ui'
  ],
  runtimeConfig: {
    // Private keys that are only available server-side
    adminPassword: '', // can be overridden by NUXT_ADMIN_PASSWORD environment variable
    public: {
      // Keys within public are also exposed client-side
      googleMapsApiKey: '', // can be overridden by NUXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable
    }
  },
  app: {
    head: {
      script: []  // Google Maps is now loaded via plugin
    }
  },
  tailwindcss: {
    exposeConfig: true
  }
})
