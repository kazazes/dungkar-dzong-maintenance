import { PrismaClient } from '@prisma/client'
import { H3Event, createError } from 'h3'

const prisma = new PrismaClient()

interface ResolveBody {
    resolvedBy: string
    resolutionNotes: string
}

export default defineEventHandler(async (event: H3Event) => {
    try {
        const id = parseInt(event.context.params.id)
        const body = await readBody<ResolveBody>(event)

        const request = await prisma.maintenanceRequest.update({
            where: { id },
            data: {
                status: 'RESOLVED',
                resolvedBy: body.resolvedBy,
                resolvedAt: new Date(),
                resolutionNotes: body.resolutionNotes
            }
        })

        return request
    } catch (error) {
        console.error('Error resolving maintenance request:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error resolving maintenance request'
        })
    }
}) 