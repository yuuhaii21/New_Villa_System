<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Simple Header -->
    <header class="bg-white shadow">
      <div class="px-6 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Villa Dashboard</h1>
            <p class="text-gray-600">Welcome back, {{ authStore.user?.name }}</p>
          </div>
          <button @click="logout" class="btn btn-danger">Logout</button>
        </div>
      </div>
    </header>

    <main class="p-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <span class="text-2xl">🏠</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Villas</p>
              <p class="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 text-green-600 rounded-xl">
              <span class="text-2xl">📅</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Active Bookings</p>
              <p class="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <span class="text-2xl">👥</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Guests Today</p>
              <p class="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <span class="text-2xl">💰</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Revenue Today</p>
              <p class="text-2xl font-bold">$8,420</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card mb-8">
        <h2 class="text-xl font-semibold mb-6">Quick Actions</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link to="/bookings" class="p-4 bg-primary-50 rounded-lg text-center hover:bg-primary-100 transition-colors">
            <div class="text-2xl mb-2">📅</div>
            <p class="font-medium">New Booking</p>
          </router-link>
          
          <router-link to="/check-in-out" class="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
            <div class="text-2xl mb-2">🔑</div>
            <p class="font-medium">Check In</p>
          </router-link>
          
          <router-link to="/villas" class="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <div class="text-2xl mb-2">🏠</div>
            <p class="font-medium">Manage Villas</p>
          </router-link>
          
          <router-link to="/payments" class="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <div class="text-2xl mb-2">💰</div>
            <p class="font-medium">Process Payment</p>
          </router-link>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-6">Recent Activity</h2>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-3 hover:bg-gray-50 rounded-lg">
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
              <span class="text-lg">{{ activity.icon }}</span>
            </div>
            <div class="flex-1">
              <p class="font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
            </div>
            <span class="text-sm text-gray-500">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const recentActivities = ref([
  { id: 1, icon: '🏠', title: 'New Villa Added', description: 'Luxury Villa #15 has been added to the system', time: '10 min ago' },
  { id: 2, icon: '👤', title: 'Guest Checked In', description: 'John Doe checked into Villa 3', time: '30 min ago' },
  { id: 3, icon: '💰', title: 'Payment Received', description: 'Payment of $2,500 received for Booking #456', time: '1 hour ago' },
  { id: 4, icon: '📅', title: 'Booking Confirmed', description: 'New booking confirmed for Villa 7', time: '2 hours ago' },
])

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>