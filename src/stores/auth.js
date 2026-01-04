import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('villa_user')) || null)
  const token = ref(localStorage.getItem('villa_token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isManager = computed(() => user.value?.role === 'manager')

  const login = async (credentials) => {
    // Demo users
    const demoUsers = [
      { 
        id: 1, 
        email: 'admin@villa.com', 
        password: 'admin123', 
        name: 'Admin User', 
        role: 'admin',
        avatar: '👑'
      },
      { 
        id: 2, 
        email: 'manager@villa.com', 
        password: 'manager123', 
        name: 'Villa Manager', 
        role: 'manager',
        avatar: '👨‍💼'
      },
      { 
        id: 3, 
        email: 'staff@villa.com', 
        password: 'staff123', 
        name: 'Reception Staff', 
        role: 'staff',
        avatar: '👩‍💼'
      }
    ]

    const foundUser = demoUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    )

    if (foundUser) {
      const { password, ...userData } = foundUser
      user.value = userData
      token.value = 'villa-token-' + Date.now()
      
      localStorage.setItem('villa_user', JSON.stringify(userData))
      localStorage.setItem('villa_token', token.value)
      
      return { success: true, user: userData }
    }
    
    return { success: false, message: 'Invalid email or password' }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('villa_user')
    localStorage.removeItem('villa_token')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isManager,
    login,
    logout
  }
})