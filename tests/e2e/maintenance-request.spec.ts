import { expect, test } from '@playwright/test'

test.describe('Maintenance Request Flow', () => {
    test('should submit a maintenance request successfully without map selection', async ({ page }) => {
        // Navigate to the home page
        await page.goto('/')

        // Fill in contact details
        await page.fill('#contactName', 'Test User')
        await page.fill('#contactNumber', '1234567890')

        // Select category and priority
        await page.selectOption('#category', 'ELECTRICAL')
        await page.selectOption('#priority', 'LOW')

        // Fill in maintenance details
        await page.fill('#details', 'Test maintenance request details')

        // Fill in location description
        await page.fill('#location', 'Test Location')

        // Handle alert dialog
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Maintenance request submitted successfully!')
            await dialog.accept()
        })

        // Submit the form
        const submitButton = page.locator('button[type="submit"]')
        await expect(submitButton).toBeEnabled()
        await submitButton.click()

        // Verify form is reset
        await expect(page.locator('#contactName')).toHaveValue('')
        await expect(page.locator('#contactNumber')).toHaveValue('')
        await expect(page.locator('#category')).toHaveValue('')
        await expect(page.locator('#priority')).toHaveValue('')
        await expect(page.locator('#details')).toHaveValue('')
        await expect(page.locator('#location')).toHaveValue('')
    })

    test('should require all mandatory fields', async ({ page }) => {
        // Navigate to the home page
        await page.goto('/')

        // Try to submit without filling any fields
        const submitButton = page.locator('button[type="submit"]')
        await submitButton.click()

        // Check for HTML5 validation messages
        const requiredFields = [
            '#contactName',
            '#contactNumber',
            '#category',
            '#priority',
            '#details',
            '#location'
        ]

        for (const field of requiredFields) {
            const element = page.locator(field)
            await expect(element).toHaveAttribute('required', '')
        }
    })

    test('should handle image upload', async ({ page }) => {
        // Navigate to the home page
        await page.goto('/')

        // Create a test file input
        await page.setInputFiles('#image', {
            name: 'test-image.png',
            mimeType: 'image/png',
            buffer: Buffer.from('fake image content')
        })

        // Verify image preview is shown
        await expect(page.locator('img[alt="Preview"]')).toBeVisible()

        // Test remove image functionality
        await page.click('button:has-text("Remove image")')
        await expect(page.locator('img[alt="Preview"]')).not.toBeVisible()
    })
})

test.describe('Admin Flow', () => {
    test('should login and view maintenance requests', async ({ page }) => {
        // Navigate to admin login
        await page.goto('/admin/login')

        // Fill in password and submit form
        await page.fill('#password', process.env.ADMIN_PASSWORD || 'dzong')
        await page.click('button[type="submit"]')

        // Wait for navigation to complete
        await page.waitForURL('/admin')

        // Check for main elements
        await expect(page.getByText('Open Requests')).toBeVisible()
        await expect(page.getByText('Resolved Requests')).toBeVisible()
    })
}) 