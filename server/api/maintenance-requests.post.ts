import { PrismaClient } from '@prisma/client'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const formData = await readMultipartFormData(event)
        if (!formData) throw new Error('No form data received')

        const data: Record<string, any> = {}
        let imageFile = null

        // Process form data
        for (const field of formData) {
            if (field.name === 'image') {
                imageFile = field
            } else {
                data[field.name] = field.data.toString()
            }
        }

        // Handle image upload if present
        let imagePath = null
        if (imageFile) {
            // Create uploads directory if it doesn't exist
            const uploadsDir = join(process.cwd(), 'public', 'uploads')
            await mkdir(uploadsDir, { recursive: true })

            // Generate unique filename
            const filename = `${Date.now()}-${imageFile.filename}`
            const filePath = join(uploadsDir, filename)

            // Save file
            await writeFile(filePath, imageFile.data)
            imagePath = `/uploads/${filename}`
        }

        // Create maintenance request
        const maintenanceRequest = await prisma.maintenanceRequest.create({
            data: {
                location: data.location,
                contactName: data.contactName,
                contactNumber: data.contactNumber,
                priority: data.priority,
                details: data.details,
                imagePath: imagePath
            },
        })

        return maintenanceRequest
    } catch (error) {
        console.error('Error creating maintenance request:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error creating maintenance request'
        })
    }
}) 