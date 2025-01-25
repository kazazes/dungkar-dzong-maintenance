import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig()

    // Only load on client side
    if (process.client) {
        // Create a promise to load the script
        const loadGoogleMaps = new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}`
            script.async = true
            script.defer = true

            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load Google Maps'))

            document.head.appendChild(script)
        })

        try {
            await loadGoogleMaps
            console.log('Google Maps loaded successfully')
        } catch (error) {
            console.error('Error loading Google Maps:', error)
        }
    }
}) 