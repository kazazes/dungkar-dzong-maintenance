import { PrismaClient } from '@prisma/client'
import { mkdir, writeFile } from 'fs/promises'
import { H3Event, createError } from 'h3'
import { join } from 'path'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
    try {
        const id = parseInt(event.context.params?.id || '')
        if (isNaN(id)) {
            throw new Error('Invalid request ID')
        }

        const formData = await readMultipartFormData(event)
        if (!formData) throw new Error('No form data received')

        const data: Record<string, string> = {}
        const resolutionImages: { filename: string; data: Buffer }[] = []

        // Process form data
        for (const field of formData) {
            const fieldName = field.name || ''
            if (fieldName.startsWith('resolutionImage')) {
                resolutionImages.push({
                    filename: field.filename || `${Date.now()}.jpg`,
                    data: field.data
                })
            } else {
                data[fieldName] = field.data.toString()
            }
        }

        // Validate required fields
        if (!data.resolvedBy || !data.resolutionNotes) {
            throw new Error('Missing required fields')
        }

        // Handle resolution images
        const resolutionImagePaths: string[] = []
        if (resolutionImages.length > 0) {
            // Create uploads directory if it doesn't exist
            const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resolutions')
            await mkdir(uploadsDir, { recursive: true })

            // Save each image
            for (const image of resolutionImages) {
                const filename = `${Date.now()}-${image.filename}`
                const filePath = join(uploadsDir, filename)
                await writeFile(filePath, image.data)
                resolutionImagePaths.push(`/uploads/resolutions/${filename}`)
            }
        }

        // Update maintenance request
        const request = await prisma.maintenanceRequest.update({
            where: { id },
            data: {
                status: 'RESOLVED',
                resolvedBy: data.resolvedBy,
                resolvedAt: new Date(),
                resolutionNotes: data.resolutionNotes,
                resolutionImages: resolutionImagePaths
            }
        })

        return request
    } catch (error) {
        console.error('Error resolving maintenance request:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : 'Error resolving maintenance request'
        })
    }
}) 