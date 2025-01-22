import { PrismaClient } from '@prisma/client'
import { H3Event, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
    try {
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const pageSize = parseInt(query.pageSize as string) || 10
        const status = query.status as string || undefined

        const requests = await prisma.maintenanceRequest.findMany({
            where: {
                status: status
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize
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