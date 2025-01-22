<template>
    <div class="space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-semibold text-gray-900">Submit a Maintenance Request</h2>
            <p class="mt-2 text-gray-600">
                Use this form to report any maintenance needs within Dungkar Dzong.
                We'll address your request based on the priority level.
            </p>
        </div>
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <MaintenanceRequestForm />
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default'
})
</script>