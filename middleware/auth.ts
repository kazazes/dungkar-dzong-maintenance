import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'

export default defineNuxtRouteMiddleware((to) => {
    const isAuthenticated = useCookie('admin_authenticated')

    // If not authenticated and trying to access admin page
    if (!isAuthenticated.value && to.path.startsWith('/admin')) {
        return navigateTo('/admin/login')
    }
}) 