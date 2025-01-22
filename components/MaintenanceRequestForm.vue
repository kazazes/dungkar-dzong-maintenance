<template>
    <div class="max-w-2xl mx-auto p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Dungkar Dzong Maintenance Request</h2>
        <form @submit.prevent="submitForm" class="space-y-6">
            <div class="form-group">
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input id="location" v-model="formData.location" type="text" required
                    placeholder="Enter location in Dungkar Dzong"
                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div class="form-group">
                <label for="contactName" class="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input id="contactName" v-model="formData.contactName" type="text" required placeholder="Your full name"
                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div class="form-group">
                <label for="contactNumber" class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input id="contactNumber" v-model="formData.contactNumber" type="tel" required
                    placeholder="Your phone number"
                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div class="form-group">
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                <select id="priority" v-model="formData.priority" required
                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option value="">Select priority level</option>
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent</option>
                </select>
            </div>

            <div class="form-group">
                <label for="details" class="block text-sm font-medium text-gray-700 mb-1">Maintenance Details</label>
                <textarea id="details" v-model="formData.details" required rows="4"
                    placeholder="Please describe what needs to be repaired..."
                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>

            <div class="form-group">
                <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
                <div class="mt-1 flex items-center">
                    <input type="file" id="image" ref="imageInput" accept="image/*" @change="handleImageChange"
                        class="hidden" />
                    <button type="button" @click="$refs.imageInput.click()"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Choose Image
                    </button>
                    <span v-if="selectedImage" class="ml-4 text-sm text-gray-500">{{ selectedImage.name }}</span>
                </div>
                <div v-if="imagePreview" class="mt-2">
                    <img :src="imagePreview" alt="Preview" class="h-32 w-auto rounded-lg object-cover" />
                    <button type="button" @click="removeImage" class="mt-2 text-sm text-red-600 hover:text-red-500">
                        Remove image
                    </button>
                </div>
            </div>

            <div class="pt-6">
                <button type="submit" :disabled="isSubmitting"
                    class="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span>{{ isSubmitting ? 'Submitting...' : 'Submit Request' }}</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
    location: '',
    contactName: '',
    contactNumber: '',
    priority: '',
    details: ''
})

const isSubmitting = ref(false)
const imageInput = ref(null)
const selectedImage = ref(null)
const imagePreview = ref(null)

const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedImage.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const removeImage = () => {
    selectedImage.value = null
    imagePreview.value = null
    if (imageInput.value) {
        imageInput.value.value = ''
    }
}

const submitForm = async () => {
    if (isSubmitting.value) return

    isSubmitting.value = true
    try {
        const formDataToSend = new FormData()
        Object.entries(formData.value).forEach(([key, value]) => {
            formDataToSend.append(key, value)
        })

        if (selectedImage.value) {
            formDataToSend.append('image', selectedImage.value)
        }

        const response = await $fetch('/api/maintenance-requests', {
            method: 'POST',
            body: formDataToSend
        })

        formData.value = {
            location: '',
            contactName: '',
            contactNumber: '',
            priority: '',
            details: ''
        }
        removeImage()
        alert('Maintenance request submitted successfully!')
    } catch (error) {
        console.error('Error submitting form:', error)
        alert('Failed to submit maintenance request. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}
</script>