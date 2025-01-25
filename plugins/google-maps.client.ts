import { defineNuxtPlugin, useRuntimeConfig } from '#app'

// Create a promise that will resolve when Google Maps is loaded
let googleMapsReady: Promise<void>

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig()

    // Debug runtime config
    console.log('Runtime config:', {
        googleMapsApiKey: config.public.googleMapsApiKey,
        keyExists: !!config.public.googleMapsApiKey,
        keyLength: config.public.googleMapsApiKey?.length
    })

    // Only load on client side
    if (process.client) {
        // Initialize the loading promise
        googleMapsReady = new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            const apiKey = config.public.googleMapsApiKey

            if (!apiKey) {
                return reject(new Error('Google Maps API key is not configured'))
            }

            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
            console.log('Loading Google Maps with URL:', script.src)

            script.async = true
            script.defer = true

            script.onload = () => {
                console.log('Google Maps script loaded successfully')
                resolve()
            }
            script.onerror = (error) => {
                console.error('Failed to load Google Maps script:', error)
                reject(new Error('Failed to load Google Maps'))
            }

            document.head.appendChild(script)
        })

        // Provide the ready promise to components
        nuxtApp.provide('googleMapsReady', googleMapsReady)
    }
}) 