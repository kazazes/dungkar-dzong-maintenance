<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Admin Login
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input id="password" v-model="password" name="password" type="password" required
                        class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Enter admin password" />
                </div>

                <div>
                    <button type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign in
                    </button>
                </div>

                <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
const password = ref('')
const error = ref('')
const router = useRouter()
const adminAuth = useCookie('admin_authenticated')

const handleLogin = () => {
    if (password.value === 'dzong') {
        adminAuth.value = 'true'
        router.push('/admin')
        error.value = ''
    } else {
        error.value = 'Invalid password'
    }
}

// Redirect if already authenticated
if (adminAuth.value) {
    router.push('/admin')
}
</script>