import { useRuntimeConfig } from '#imports'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    if (!body.password) {
        throw createError({
            statusCode: 400,
            message: 'Password is required'
        })
    }

    if (body.password !== config.adminPassword) {
        throw createError({
            statusCode: 401,
            message: 'Invalid password'
        })
    }

    return {
        success: true
    }
}) 