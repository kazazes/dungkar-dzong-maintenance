<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
                <button @click="logout" class="px-4 py-2 text-sm text-red-600 hover:text-red-700">
                    Logout
                </button>
            </div>

            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="request in requests" :key="request.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ request.id }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.location }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ request.contactName }}</div>
                                    <div class="text-sm text-gray-500">{{ request.contactNumber }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="priorityClasses(request.priority)">
                                        {{ request.priority }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="statusClasses(request.status)">
                                        {{ request.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(request.createdAt) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button v-if="request.status === 'PENDING'" @click="openResolveModal(request)"
                                        class="text-indigo-600 hover:text-indigo-900">
                                        Resolve
                                    </button>
                                    <button @click="openDetailsModal(request)"
                                        class="ml-3 text-gray-600 hover:text-gray-900">
                                        Details
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Resolve Modal -->
        <div v-if="showResolveModal"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-lg w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Resolve Maintenance Request</h3>
                <form @submit.prevent="resolveRequest">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Resolved By</label>
                            <input v-model="resolveForm.resolvedBy" type="text" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Resolution Notes</label>
                            <textarea v-model="resolveForm.resolutionNotes" rows="3" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-5 flex justify-end space-x-3">
                        <button type="button" @click="showResolveModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Details Modal -->
        <div v-if="showDetailsModal"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Request Details</h3>
                <div class="space-y-4">
                    <div v-if="selectedRequest">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Location</h4>
                                <p class="mt-1">{{ selectedRequest.location }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Priority</h4>
                                <p class="mt-1">
                                    <span :class="priorityClasses(selectedRequest.priority)">
                                        {{ selectedRequest.priority }}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Contact Name</h4>
                                <p class="mt-1">{{ selectedRequest.contactName }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Contact Number</h4>
                                <p class="mt-1">{{ selectedRequest.contactNumber }}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <h4 class="text-sm font-medium text-gray-500">Details</h4>
                            <p class="mt-1">{{ selectedRequest.details }}</p>
                        </div>
                        <div v-if="selectedRequest.imagePath" class="mt-4">
                            <h4 class="text-sm font-medium text-gray-500">Image</h4>
                            <img :src="selectedRequest.imagePath" alt="Maintenance request image"
                                class="mt-1 max-h-48 rounded-lg" />
                        </div>
                        <div v-if="selectedRequest.status === 'RESOLVED'" class="mt-4 pt-4 border-t">
                            <h4 class="text-sm font-medium text-gray-500">Resolution Details</h4>
                            <div class="mt-2 grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-500">Resolved By</p>
                                    <p class="mt-1">{{ selectedRequest.resolvedBy }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Resolved At</p>
                                    <p class="mt-1">{{ formatDate(selectedRequest.resolvedAt) }}</p>
                                </div>
                            </div>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Resolution Notes</p>
                                <p class="mt-1">{{ selectedRequest.resolutionNotes }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 flex justify-end">
                    <button type="button" @click="showDetailsModal = false"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
    middleware: 'auth'
})

interface MaintenanceRequest {
    id: number
    location: string
    contactName: string
    contactNumber: string
    priority: string
    status: string
    details: string
    imagePath?: string
    resolvedBy?: string
    resolvedAt?: string
    resolutionNotes?: string
    createdAt: string
    updatedAt: string
}

const router = useRouter()
const requests = ref<MaintenanceRequest[]>([])
const showResolveModal = ref(false)
const showDetailsModal = ref(false)
const selectedRequest = ref<MaintenanceRequest | null>(null)
const resolveForm = ref({
    resolvedBy: '',
    resolutionNotes: ''
})

// Fetch requests
const fetchRequests = async () => {
    try {
        const response = await $fetch<MaintenanceRequest[]>('/api/maintenance-requests')
        requests.value = response
    } catch (error) {
        console.error('Error fetching requests:', error)
    }
}

// Format date
const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
}

// Priority classes
const priorityClasses = (priority: string) => {
    const classes = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (priority) {
        case 'LOW':
            return `${classes} bg-green-100 text-green-800`
        case 'MEDIUM':
            return `${classes} bg-yellow-100 text-yellow-800`
        case 'HIGH':
            return `${classes} bg-orange-100 text-orange-800`
        case 'URGENT':
            return `${classes} bg-red-100 text-red-800`
        default:
            return classes
    }
}

// Status classes
const statusClasses = (status: string) => {
    const classes = 'px-2 py-1 text-xs font-medium rounded-full'
    return status === 'PENDING'
        ? `${classes} bg-yellow-100 text-yellow-800`
        : `${classes} bg-green-100 text-green-800`
}

// Open resolve modal
const openResolveModal = (request: MaintenanceRequest) => {
    selectedRequest.value = request
    showResolveModal.value = true
}

// Open details modal
const openDetailsModal = (request: MaintenanceRequest) => {
    selectedRequest.value = request
    showDetailsModal.value = true
}

// Resolve request
const resolveRequest = async () => {
    if (!selectedRequest.value) return

    try {
        await $fetch(`/api/maintenance-requests/${selectedRequest.value.id}/resolve`, {
            method: 'POST',
            body: resolveForm.value
        })
        showResolveModal.value = false
        resolveForm.value = { resolvedBy: '', resolutionNotes: '' }
        await fetchRequests()
    } catch (error) {
        console.error('Error resolving request:', error)
    }
}

// Logout
const logout = () => {
    const adminAuth = useCookie('admin_authenticated')
    adminAuth.value = null
    router.push('/admin/login')
}

// Fetch requests on mount
onMounted(() => {
    fetchRequests()
})
</script>