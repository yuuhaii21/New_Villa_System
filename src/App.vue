@'
<template>
  <div id="app">
    <!-- Login Screen -->
    <div v-if="!isLoggedIn" class="login-screen">
      <div class="header">
        <h1>🏠 Villa Management System</h1>
        <p>Manage luxury villas with ease</p>
      </div>
      
      <div class="login-container">
        <div class="login-card">
          <h2>Sign In</h2>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" v-model="email" placeholder="admin@villa.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="••••••••">
          </div>
          <div v-if="error" class="error-message">{{ error }}</div>
          <button class="btn" @click="login">Sign In to Dashboard</button>
          
          <div class="demo-info">
            <p><strong>Demo Credentials:</strong></p>
            <p>👑 Admin: admin@villa.com / admin123</p>
            <p>👨‍💼 Manager: manager@villa.com / manager123</p>
            <p>👩‍💼 Staff: staff@villa.com / staff123</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dashboard -->
    <div v-else class="dashboard">
      <header class="dashboard-header">
        <div class="header-left">
          <h1>🏠 Villa System</h1>
          <p>Welcome back, {{ userName }}!</p>
        </div>
        <div class="header-right">
          <button class="btn-logout" @click="logout">Logout</button>
        </div>
      </header>
      
      <div class="dashboard-content">
        <!-- Sidebar -->
        <div class="sidebar">
          <h3>Navigation</h3>
          <ul>
            <li :class="{active: activeSection === 'dashboard'}" @click="activeSection = 'dashboard'">
              📊 Dashboard
            </li>
            <li :class="{active: activeSection === 'staff'}" @click="activeSection = 'staff'">
              👥 Staff Management
            </li>
            <li :class="{active: activeSection === 'bookings'}" @click="activeSection = 'bookings'">
              📅 Bookings
            </li>
            <li :class="{active: activeSection === 'villas'}" @click="activeSection = 'villas'">
              🏠 Villas
            </li>
            <li :class="{active: activeSection === 'checkin'}" @click="activeSection = 'checkin'">
              🔑 Check In/Out
            </li>
            <li :class="{active: activeSection === 'payments'}" @click="activeSection = 'payments'">
              💰 Payments
            </li>
          </ul>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
          <!-- Dashboard Section -->
          <div v-if="activeSection === 'dashboard'" class="section">
            <h2>Dashboard Overview</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">🏠</div>
                <div class="stat-info">
                  <h4>Total Villas</h4>
                  <p class="stat-number">12</p>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                  <h4>Active Bookings</h4>
                  <p class="stat-number">8</p>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                  <h4>Guests Today</h4>
                  <p class="stat-number">24</p>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                  <h4>Today's Revenue</h4>
                  <p class="stat-number">$8,420</p>
                </div>
              </div>
            </div>
            
            <h3>Recent Activity</h3>
            <div class="activity-list">
              <div class="activity-item">✅ New booking confirmed for Villa #3</div>
              <div class="activity-item">👤 Guest checked into Villa #7</div>
              <div class="activity-item">💰 Payment received: $2,500</div>
              <div class="activity-item">🏠 New villa added: Luxury Villa #15</div>
            </div>
          </div>
          
          <!-- Staff Management Section -->
          <div v-if="activeSection === 'staff'" class="section">
            <h2>Staff Management</h2>
            <div class="section-header">
              <button class="btn-add" @click="showStaffForm = true">+ Add Staff</button>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="staff in staffList" :key="staff.id">
                  <td>{{ staff.id }}</td>
                  <td>{{ staff.name }}</td>
                  <td>{{ staff.email }}</td>
                  <td><span class="badge" :class="staff.role">{{ staff.role }}</span></td>
                  <td>
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Booking Management Section -->
          <div v-if="activeSection === 'bookings'" class="section">
            <h2>Booking Management</h2>
            <p>Manage villa bookings here.</p>
          </div>
          
          <!-- Villa Management Section -->
          <div v-if="activeSection === 'villas'" class="section">
            <h2>Villa Management</h2>
            <p>Manage villa listings here.</p>
          </div>
          
          <!-- Check In/Out Section -->
          <div v-if="activeSection === 'checkin'" class="section">
            <h2>Check In/Out</h2>
            <p>Manage guest check-ins and check-outs here.</p>
          </div>
          
          <!-- Payment Management Section -->
          <div v-if="activeSection === 'payments'" class="section">
            <h2>Payment Management</h2>
            <p>Manage payments and invoices here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Login state
const isLoggedIn = ref(false)
const email = ref('admin@villa.com')
const password = ref('admin123')
const error = ref('')
const userName = ref('Admin')

// Dashboard state
const activeSection = ref('dashboard')
const showStaffForm = ref(false)

// Staff data
const staffList = ref([
  { id: 1, name: 'John Smith', email: 'john@villa.com', role: 'admin' },
  { id: 2, name: 'Maria Garcia', email: 'maria@villa.com', role: 'manager' },
  { id: 3, name: 'David Lee', email: 'david@villa.com', role: 'staff' },
  { id: 4, name: 'Sarah Johnson', email: 'sarah@villa.com', role: 'staff' },
])

// Login function
const login = () => {
  error.value = ''
  
  // Demo authentication
  const validUsers = {
    'admin@villa.com': { password: 'admin123', name: 'Admin' },
    'manager@villa.com': { password: 'manager123', name: 'Manager' },
    'staff@villa.com': { password: 'staff123', name: 'Staff' }
  }
  
  if (validUsers[email.value] && validUsers[email.value].password === password.value) {
    isLoggedIn.value = true
    userName.value = validUsers[email.value].name
  } else {
    error.value = 'Invalid email or password'
  }
}

// Logout function
const logout = () => {
  isLoggedIn.value = false
  email.value = 'admin@villa.com'
  password.value = 'admin123'
  activeSection.value = 'dashboard'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
}

/* Login Screen */
.login-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.login-card h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e53e3e;
  margin: 10px 0;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.demo-info {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #e2e8f0;
  color: #666;
  font-size: 14px;
}

.demo-info strong {
  color: #333;
}

/* Dashboard */
.dashboard {
  min-height: 100vh;
}

.dashboard-header {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-left h1 {
  color: #333;
  margin-bottom: 5px;
}

.header-left p {
  color: #666;
}

.btn-logout {
  padding: 8px 20px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: calc(100vh - 100px);
}

.sidebar {
  background: #2d3748;
  color: white;
  padding: 30px 20px;
}

.sidebar h3 {
  margin-bottom: 20px;
  color: #a0aec0;
}

.sidebar ul {
  list-style: none;
}

.sidebar li {
  padding: 12px 15px;
  margin: 5px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar li:hover {
  background: rgba(255,255,255,0.1);
}

.sidebar li.active {
  background: #667eea;
}

.main-content {
  padding: 30px;
  background: #f7fafc;
}

.section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.stat-info h4 {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.activity-list {
  margin-top: 20px;
}

.activity-item {
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.data-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-top: 20px;
}

.data-table th {
  background: #f7fafc;
  padding: 15px;
  text-align: left;
  color: #666;
  font-weight: 600;
}

.data-table td {
  padding: 15px;
  border-top: 1px solid #e2e8f0;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.admin { background: #e6fffa; color: #234e52; }
.badge.manager { background: #ebf8ff; color: #2c5282; }
.badge.staff { background: #faf5ff; color: #553c9a; }

.btn-edit, .btn-delete {
  padding: 6px 12px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit { background: #4299e1; color: white; }
.btn-delete { background: #f56565; color: white; }

.btn-add {
  padding: 10px 20px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: 2;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}
</style>
'@ | Set-Content -Path "src/App.vue" -Encoding UTF8