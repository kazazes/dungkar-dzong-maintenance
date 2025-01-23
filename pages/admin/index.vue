<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
                <button @click="logout" class="px-4 py-2 text-sm text-red-600 hover:text-red-700">
                    Logout
                </button>
            </div>

            <!-- Open Requests -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Open Requests</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category</th>
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
                                    Created</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="request in openRequests" :key="request.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ request.id }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="categoryClasses(request.category)">
                                        {{ formatCategory(request.category) }}
                                    </span>
                                </td>
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
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(request.createdAt) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button @click="openResolveModal(request)"
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
                <div v-if="hasMoreOpenRequests" class="px-6 py-4 border-t border-gray-200">
                    <button @click="loadMoreOpenRequests" class="text-sm text-indigo-600 hover:text-indigo-900">
                        Load More
                    </button>
                </div>
            </div>

            <!-- Resolved Requests -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Resolved Requests</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category</th>
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
                                    Resolved</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time to Resolution</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="request in resolvedRequests" :key="request.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ request.id }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="categoryClasses(request.category)">
                                        {{ formatCategory(request.category) }}
                                    </span>
                                </td>
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
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(request.resolvedAt || '') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ calculateResolutionTime(request.createdAt, request.resolvedAt || '') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button @click="openDetailsModal(request)"
                                        class="text-gray-600 hover:text-gray-900">
                                        Details
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="hasMoreResolvedRequests" class="px-6 py-4 border-t border-gray-200">
                    <button @click="loadMoreResolvedRequests" class="text-sm text-indigo-600 hover:text-indigo-900">
                        Load More
                    </button>
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
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Resolution Images</label>
                            <div class="mt-1 flex items-center">
                                <input type="file" id="resolutionImage" ref="resolutionImageInput" accept="image/*"
                                    @change="handleResolutionImageChange" class="hidden" multiple />
                                <button type="button" @click="$refs.resolutionImageInput.click()"
                                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Choose Images
                                </button>
                            </div>
                            <div v-if="resolutionImages.length > 0" class="mt-4 grid grid-cols-2 gap-4">
                                <div v-for="(image, index) in resolutionImages" :key="index" class="relative">
                                    <img :src="image.preview" alt="Resolution image preview"
                                        class="h-32 w-full object-cover rounded-lg" />
                                    <button type="button" @click="removeResolutionImage(index)"
                                        class="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200">
                                        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
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
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Request Details</h3>
                </div>
                <div class="p-6 overflow-y-auto flex-1">
                    <div class="space-y-6">
                        <div v-if="selectedRequest">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 class="text-sm font-medium text-gray-500">Category</h4>
                                    <p class="mt-1">
                                        <span :class="categoryClasses(selectedRequest.category)">
                                            {{ formatCategory(selectedRequest.category) }}
                                        </span>
                                    </p>
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
                            <div class="mt-6">
                                <h4 class="text-sm font-medium text-gray-500">Location</h4>
                                <p class="mt-1">{{ selectedRequest.location }}</p>
                                <div v-if="selectedRequest.latitude && selectedRequest.longitude"
                                    class="mt-2 h-64 rounded-lg overflow-hidden">
                                    <LocationMap
                                        :modelValue="{ lat: selectedRequest.latitude, lng: selectedRequest.longitude }"
                                        :readonly="true" />
                                </div>
                                <p v-else class="mt-2 text-sm text-gray-500">No map location provided</p>
                            </div>
                            <div class="mt-6">
                                <h4 class="text-sm font-medium text-gray-500">Details</h4>
                                <p class="mt-1">{{ selectedRequest.details }}</p>
                            </div>
                            <div v-if="selectedRequest.imagePath" class="mt-6">
                                <h4 class="text-sm font-medium text-gray-500">Request Image</h4>
                                <img :src="selectedRequest.imagePath" alt="Maintenance request image"
                                    class="mt-2 max-h-64 rounded-lg" />
                            </div>
                            <div v-if="selectedRequest.status === 'RESOLVED'" class="mt-6 pt-6 border-t">
                                <h4 class="text-sm font-medium text-gray-500">Resolution Details</h4>
                                <div class="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500">Resolved By</p>
                                        <p class="mt-1">{{ selectedRequest.resolvedBy }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Resolved At</p>
                                        <p class="mt-1">{{ formatDate(selectedRequest.resolvedAt || '') }}</p>
                                    </div>
                                    <div class="col-span-2">
                                        <p class="text-sm text-gray-500">Time to Resolution</p>
                                        <p class="mt-1">{{ calculateResolutionTime(selectedRequest.createdAt,
                                            selectedRequest.resolvedAt || '') }}</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <p class="text-sm text-gray-500">Resolution Notes</p>
                                    <p class="mt-1">{{ selectedRequest.resolutionNotes }}</p>
                                </div>
                                <div v-if="selectedRequest.resolutionImages?.length" class="mt-6">
                                    <h4 class="text-sm font-medium text-gray-500">Resolution Images</h4>
                                    <div class="mt-2 grid grid-cols-2 gap-4">
                                        <div v-for="(image, index) in selectedRequest.resolutionImages" :key="index"
                                            class="relative">
                                            <img :src="image" :alt="`Resolution image ${index + 1}`"
                                                class="w-full aspect-video object-cover rounded-lg" />
                                            <button type="button" @click="openImageInNewTab(image)"
                                                class="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75">
                                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6 border-t border-gray-200">
                    <div class="flex justify-end">
                        <button type="button" @click="showDetailsModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Close
                        </button>
                    </div>
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
    latitude: number
    longitude: number
    contactName: string
    contactNumber: string
    category: string
    priority: string
    status: string
    details: string
    imagePath?: string
    resolvedBy?: string
    resolvedAt?: string
    resolutionNotes?: string
    resolutionImages?: string[]
    createdAt: string
    updatedAt: string
}

interface ResolutionImage {
    file: File
    preview: string
}

const router = useRouter()
const openRequests = ref<MaintenanceRequest[]>([])
const resolvedRequests = ref<MaintenanceRequest[]>([])
const showResolveModal = ref(false)
const showDetailsModal = ref(false)
const selectedRequest = ref<MaintenanceRequest | null>(null)
const resolveForm = ref({
    resolvedBy: '',
    resolutionNotes: ''
})
const resolutionImageInput = ref<HTMLInputElement | null>(null)
const resolutionImages = ref<ResolutionImage[]>([])

// Pagination
const openRequestsPage = ref(1)
const resolvedRequestsPage = ref(1)
const pageSize = 10
const hasMoreOpenRequests = ref(true)
const hasMoreResolvedRequests = ref(true)

// Fetch requests with pagination
const fetchRequests = async (status: 'PENDING' | 'RESOLVED', page: number) => {
    try {
        const response = await $fetch<MaintenanceRequest[]>('/api/maintenance-requests', {
            query: {
                status,
                page,
                pageSize
            }
        })

        if (response.length < pageSize) {
            if (status === 'PENDING') {
                hasMoreOpenRequests.value = false
            } else {
                hasMoreResolvedRequests.value = false
            }
        }

        if (status === 'PENDING') {
            if (page === 1) {
                openRequests.value = response
            } else {
                openRequests.value = [...openRequests.value, ...response]
            }
        } else {
            if (page === 1) {
                resolvedRequests.value = response
            } else {
                resolvedRequests.value = [...resolvedRequests.value, ...response]
            }
        }
    } catch (error) {
        console.error('Error fetching requests:', error)
    }
}

const loadMoreOpenRequests = async () => {
    openRequestsPage.value++
    await fetchRequests('PENDING', openRequestsPage.value)
}

const loadMoreResolvedRequests = async () => {
    resolvedRequestsPage.value++
    await fetchRequests('RESOLVED', resolvedRequestsPage.value)
}

// Format date
const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
}

// Format category
const formatCategory = (category: string) => {
    return category.replace('_', ' ').replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

// Category classes
const categoryClasses = (category: string) => {
    const classes = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (category) {
        case 'ELECTRICAL':
            return `${classes} bg-yellow-100 text-yellow-800`
        case 'PLUMBING':
            return `${classes} bg-blue-100 text-blue-800`
        case 'INTERNET_CABLE':
            return `${classes} bg-purple-100 text-purple-800`
        case 'OTHER':
            return `${classes} bg-gray-100 text-gray-800`
        default:
            return classes
    }
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

const handleResolutionImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files) return

    Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
            resolutionImages.value.push({
                file,
                preview: e.target?.result as string
            })
        }
        reader.readAsDataURL(file)
    })
}

const removeResolutionImage = (index: number) => {
    resolutionImages.value.splice(index, 1)
}

const resolveRequest = async () => {
    if (!selectedRequest.value) return

    try {
        const formData = new FormData()
        formData.append('resolvedBy', resolveForm.value.resolvedBy)
        formData.append('resolutionNotes', resolveForm.value.resolutionNotes)

        // Append resolution images
        resolutionImages.value.forEach((image, index) => {
            formData.append(`resolutionImage${index}`, image.file)
        })

        await $fetch(`/api/maintenance-requests/${selectedRequest.value.id}/resolve`, {
            method: 'POST',
            body: formData
        })

        showResolveModal.value = false
        resolveForm.value = { resolvedBy: '', resolutionNotes: '' }
        resolutionImages.value = []

        // Refresh both tables
        openRequestsPage.value = 1
        resolvedRequestsPage.value = 1
        hasMoreOpenRequests.value = true
        hasMoreResolvedRequests.value = true
        await Promise.all([
            fetchRequests('PENDING', 1),
            fetchRequests('RESOLVED', 1)
        ])
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
onMounted(async () => {
    await Promise.all([
        fetchRequests('PENDING', 1),
        fetchRequests('RESOLVED', 1)
    ])
})

// Calculate resolution time
const calculateResolutionTime = (createdAt: string, resolvedAt: string) => {
    if (!resolvedAt) return '-'

    const created = new Date(createdAt)
    const resolved = new Date(resolvedAt)
    const diffInMillis = resolved.getTime() - created.getTime()

    // Convert to minutes, hours, and days
    const minutes = Math.floor(diffInMillis / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
        return days === 1 ? '1 day' : `${days} days`
    }
    if (hours > 0) {
        return hours === 1 ? '1 hour' : `${hours} hours`
    }
    return minutes === 1 ? '1 minute' : `${minutes} minutes`
}

const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank')
}
</script>