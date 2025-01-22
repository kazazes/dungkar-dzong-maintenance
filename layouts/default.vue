<script setup>
// Layout component
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <header class="bg-white shadow-md">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center">
                        <h1 class="text-3xl font-bold text-indigo-900">
                            Dungkar Dzong
                        </h1>
                        <span class="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                            Maintenance System
                        </span>
                    </div>
                </div>
            </nav>
        </header>
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <slot />
        </main>
    </div>
</template>