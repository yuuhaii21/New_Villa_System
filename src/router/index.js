import { createRouter, createWebHistory } from 'vue-router'

// Import components
const AddBooking = () => import('@/components/Booking/AddBooking.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const BookingManagement = () => import('@/views/BookingManagement.vue')
// Import other components as needed...

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: BookingManagement
  },
  {
    path: '/bookings/new',
    name: 'AddBooking',
    component: AddBooking,
    meta: { requiresAuth: true }
  },
  // Add other routes...
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard (optional)
router.beforeEach((to, from, next) => {
  // Add authentication logic here if needed
  next()
})

export default router
