<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
          <span class="text-4xl text-white">🏠</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Villa Management System</h1>
        <p class="text-gray-600 mt-2">Luxury Villa Management</p>
      </div>

      <!-- Login Form -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Sign in to continue</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="admin@villa.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in to Dashboard</span>
          </button>

          <!-- Demo Credentials -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-3">Demo Credentials:</p>
            <div class="space-y-2 text-sm">
              <div class="flex items-center space-x-2">
                <span class="font-medium">Admin:</span>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-800">admin@villa.com</code>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-800">admin123</code>
              </div>
              <div class="flex items-center space-x-2">
                <span class="font-medium">Manager:</span>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-800">manager@villa.com</code>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-800">manager123</code>
              </div>
              <div class="flex items-center space-x-2">
                <span class="font-medium">Staff:</span>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-800">staff@villa.com</code>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-800">staff123</code>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: 'admin@villa.com',
  password: 'admin123'
})
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.login(form.value)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>