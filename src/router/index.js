import { createRouter, createWebHistory } from 'vue-router'

// Import views
const Login = () => import('../views/Login.vue')
const Dashboard = () => import('../views/Dashboard.vue')
// const StaffManagement = () => import('@/views/StaffManagement.vue')
// const BookingManagement = () => import('@/views/BookingManagement.vue')
// const VillaManagement = () => import('@/views/VillaManagement.vue')
// const CheckInOut = () => import('@/views/CheckInOut.vue')
// const PaymentManagement = () => import('@/views/PaymentManagement.vue')
// const Reports = () => import('@/views/Reports.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
//   {
//     path: '/staff',
//     name: 'Staff',
//     component: StaffManagement,
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/bookings',
//     name: 'Bookings',
//     component: BookingManagement,
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/villas',
//     name: 'Villas',
//     component: VillaManagement,
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/check-in-out',
//     name: 'CheckInOut',
//     component: CheckInOut,
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/payments',
//     name: 'Payments',
//     component: PaymentManagement,
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/reports',
//     name: 'Reports',
//     component: Reports,
//     meta: { requiresAuth: true }
//   }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Auth guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('villa_user')) || null
  
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router