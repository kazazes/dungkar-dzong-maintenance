import { PrismaClient } from '@prisma/client'
import { H3Event, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (_event: H3Event) => {
    try {
        const requests = await prisma.maintenanceRequest.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return requests
    } catch (error) {
        console.error('Error fetching maintenance requests:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error fetching maintenance requests'
        })
    }
}) 