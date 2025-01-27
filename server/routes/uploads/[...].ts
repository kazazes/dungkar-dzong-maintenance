import { createReadStream } from 'fs'
import { createError, defineEventHandler, sendStream } from 'h3'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    const params = Array.isArray(event.context.params._) ? event.context.params._ : []
    const filePath = params.join('/')
    const fullPath = join(process.cwd(), 'public/uploads', filePath)

    try {
        const stream = createReadStream(fullPath)
        return sendStream(event, stream)
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'File not found'
        })
    }
})

