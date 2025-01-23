import { Prisma, PrismaClient } from '@prisma/client'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

type MaintenanceRequestInput = Prisma.MaintenanceRequestCreateInput

export default defineEventHandler(async (event) => {
    try {
        const formData = await readMultipartFormData(event)
        if (!formData) throw new Error('No form data received')

        const requestData: Partial<MaintenanceRequestInput> = {}
        let imageFile = null

        // Process form data
        for (const field of formData) {
            if (field.name === 'image') {
                imageFile = field
                continue
            }

            const fieldName = field.name as keyof MaintenanceRequestInput
            if (fieldName === 'latitude' || fieldName === 'longitude') {
                // Parse coordinates as floats if provided
                const value = parseFloat(field.data.toString())
                if (!isNaN(value)) {
                    requestData[fieldName] = value
                }
            } else {
                // Handle other fields as strings
                requestData[fieldName] = field.data.toString()
            }
        }

        // Validate required fields
        const requiredFields: (keyof MaintenanceRequestInput)[] = [
            'location',
            'contactName',
            'contactNumber',
            'category',
            'priority',
            'details'
        ]

        for (const field of requiredFields) {
            if (requestData[field] === undefined) {
                throw new Error(`Missing required field: ${field}`)
            }
        }

        // Handle image upload if present
        if (imageFile) {
            // Create uploads directory if it doesn't exist
            const uploadsDir = join(process.cwd(), 'public', 'uploads')
            await mkdir(uploadsDir, { recursive: true })

            // Generate unique filename
            const filename = `${Date.now()}-${imageFile.filename}`
            const filePath = join(uploadsDir, filename)

            // Save file
            await writeFile(filePath, imageFile.data)
            requestData.imagePath = `/uploads/${filename}`
        }

        // Create maintenance request
        const maintenanceRequest = await prisma.maintenanceRequest.create({
            data: requestData as MaintenanceRequestInput
        })

        return maintenanceRequest
    } catch (error) {
        console.error('Error creating maintenance request:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : 'Error creating maintenance request'
        })
    }
}) 