<template>
  <div id="app">
    <!-- Login Screen -->
    <div v-if="!isLoggedIn" class="login-screen">
      <div class="header">
        <h1>🏠 RAVORN Villa Boutiqeu</h1>
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
      <!-- Top Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <div class="hamburger" @click="sidebarCollapsed = !sidebarCollapsed">
            ☰
          </div>
          <div>
            <h1>🏠 Villa System</h1>
            <p>Welcome back, {{ userName }}! 👋</p>
          </div>
        </div>
        
        <div class="header-right">
          <!-- Notifications -->
          <div class="notification-bell" @click="showNotifications = !showNotifications">
            🔔
            <span v-if="unreadNotifications" class="notification-count">{{ unreadNotifications }}</span>
            
            <!-- Notifications Dropdown -->
            <div v-if="showNotifications" class="notifications-dropdown">
              <div class="notifications-header">
                <h4>Notifications</h4>
                <button @click="markAllAsRead" class="mark-all-read">Mark all as read</button>
              </div>
              <div v-if="notifications.length === 0" class="empty-notifications">
                No new notifications
              </div>
              <div v-else class="notifications-list">
                <div v-for="notification in notifications" :key="notification.id" 
                     class="notification-item" :class="notification.type">
                  <div class="notification-content">
                    <strong>{{ notification.title }}</strong>
                    <p>{{ notification.message }}</p>
                    <small>{{ notification.time }}</small>
                  </div>
                  <button @click="markAsRead(notification.id)" class="notification-close">×</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- User Menu -->
          <div class="user-menu" @click="showUserMenu = !showUserMenu">
            <div class="user-avatar">{{ getUserInitials }}</div>
            <div class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
            <span class="dropdown-arrow">▼</span>
            
            <!-- User Dropdown -->
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="dropdown-item" @click="viewProfile">
                👤 Profile Settings
              </div>
              <div class="dropdown-item" @click="changePassword">
                🔒 Change Password
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click="logout">
                🚪 Logout
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div class="dashboard-content">
        <!-- Sidebar -->
        <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
          <nav>
            <ul>
              <li :class="{ active: activeSection === 'dashboard' }" @click="setActiveSection('dashboard')">
                <span class="icon">📊</span>
                <span class="text">Dashboard</span>
              </li>
              <li :class="{ active: activeSection === 'staff' }" @click="setActiveSection('staff')">
                <span class="icon">👥</span>
                <span class="text">Staff Management</span>
              </li>
              <li :class="{ active: activeSection === 'bookings' }" @click="setActiveSection('bookings')">
                <span class="icon">📅</span>
                <span class="text">Bookings</span>
              </li>
              <li :class="{ active: activeSection === 'villas' }" @click="setActiveSection('villas')">
                <span class="icon">🏠</span>
                <span class="text">Villas</span>
              </li>
              <li :class="{ active: activeSection === 'checkin' }" @click="setActiveSection('checkin')">
                <span class="icon">🔑</span>
                <span class="text">Check In/Out</span>
              </li>
              <li :class="{ active: activeSection === 'payments' }" @click="setActiveSection('payments')">
                <span class="icon">💰</span>
                <span class="text">Payments</span>
              </li>
              <li :class="{ active: activeSection === 'reports' }" @click="setActiveSection('reports')">
                <span class="icon">📈</span>
                <span class="text">Reports</span>
              </li>
              <li :class="{ active: activeSection === 'settings' }" @click="setActiveSection('settings')">
                <span class="icon">⚙️</span>
                <span class="text">Settings</span>
              </li>
            </ul>
          </nav>
          
          <!-- System Status -->
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span>System Online</span>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content" :class="{ expanded: sidebarCollapsed }">
          <!-- Loading Overlay -->
          <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
          </div>
          
          <!-- Dashboard Section -->
          <div v-if="activeSection === 'dashboard'" class="section">
            <div class="section-header">
              <h2>Dashboard Overview</h2>
              <div class="date-range">
                <select v-model="dateRange">
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="stats-grid">
              <div class="stat-card" @click="setActiveSection('villas')">
                <div class="stat-icon">🏠</div>
                <div class="stat-info">
                  <h4>Total Villas</h4>
                  <p class="stat-number">{{ stats.totalVillas }}</p>
                  <span class="stat-change positive">+2 this month</span>
                </div>
              </div>
              
              <div class="stat-card" @click="setActiveSection('bookings')">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                  <h4>Active Bookings</h4>
                  <p class="stat-number">{{ stats.activeBookings }}</p>
                  <span class="stat-change positive">+15%</span>
                </div>
              </div>
              
              <div class="stat-card" @click="setActiveSection('checkin')">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                  <h4>Today's Guests</h4>
                  <p class="stat-number">{{ stats.todaysGuests }}</p>
                  <span class="stat-change">{{ stats.newArrivals }} new arrivals</span>
                </div>
              </div>
              
              <div class="stat-card" @click="setActiveSection('payments')">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                  <h4>Revenue Today</h4>
                  <p class="stat-number">${{ stats.todaysRevenue }}</p>
                  <span class="stat-change positive">+12.5%</span>
                </div>
              </div>
            </div>
            
            <!-- Charts -->
            <div class="charts-container">
              <div class="chart-card">
                <h3>Occupancy Rate</h3>
                <div class="chart-wrapper">
                  <div class="chart-bars">
                    <div v-for="day in occupancyData" :key="day.day" class="chart-bar-container">
                      <div class="chart-bar" :style="{ height: day.percentage + '%' }">
                        <span class="bar-value">{{ day.percentage }}%</span>
                      </div>
                      <div class="bar-label">{{ day.day }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="chart-card">
                <h3>Revenue Trends</h3>
                <div class="revenue-chart">
                  <div v-for="month in revenueData" :key="month.month" class="revenue-month">
                    <div class="month-bar" :style="{ height: month.value / 1000 + 'px' }"></div>
                    <div class="month-label">{{ month.month }}</div>
                    <div class="month-amount">${{ month.value }}K</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
              <h3>Quick Actions</h3>
              <div class="actions-grid">
                <button class="action-btn" @click="setActiveSection('bookings')">
                  <span class="action-icon">➕</span>
                  <span class="action-text">New Booking</span>
                </button>
                <button class="action-btn" @click="setActiveSection('checkin')">
                  <span class="action-icon">🔑</span>
                  <span class="action-text">Check In Guest</span>
                </button>
                <button class="action-btn" @click="setActiveSection('payments')">
                  <span class="action-icon">💳</span>
                  <span class="action-text">Process Payment</span>
                </button>
                <button class="action-btn" @click="setActiveSection('villas')">
                  <span class="action-icon">🏠</span>
                  <span class="action-text">Add New Villa</span>
                </button>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="recent-activity">
              <div class="activity-header">
                <h3>Recent Activity</h3>
                <button @click="loadActivities" class="refresh-btn">🔄 Refresh</button>
              </div>
              <div class="activity-list">
                <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                  <div class="activity-icon">{{ activity.icon }}</div>
                  <div class="activity-content">
                    <p class="activity-title">{{ activity.title }}</p>
                    <p class="activity-desc">{{ activity.description }}</p>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Staff Management Section -->
          <div v-if="activeSection === 'staff'" class="section">
            <div class="section-header">
              <h2>Staff Management</h2>
              <div class="header-actions">
                <button class="btn-export" @click="exportStaffData">📊 Export</button>
                <button class="btn-add" @click="openStaffForm(null)">+ Add Staff</button>
              </div>
            </div>
            
            <!-- Staff Statistics -->
            <div class="staff-stats">
              <div class="stat-card small">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                  <h4>Total Staff</h4>
                  <p class="stat-number">{{ staffList.length }}</p>
                </div>
              </div>
              <div class="stat-card small">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                  <h4>Active</h4>
                  <p class="stat-number">{{ activeStaffCount }}</p>
                </div>
              </div>
              <div class="stat-card small">
                <div class="stat-icon">🏠</div>
                <div class="stat-info">
                  <h4>Front Desk</h4>
                  <p class="stat-number">{{ departmentCount('Front Desk') }}</p>
                </div>
              </div>
              <div class="stat-card small">
                <div class="stat-icon">🧹</div>
                <div class="stat-info">
                  <h4>Housekeeping</h4>
                  <p class="stat-number">{{ departmentCount('Housekeeping') }}</p>
                </div>
              </div>
            </div>
            
            <!-- Search and Filter -->
            <div class="table-controls">
              <div class="search-box">
                <input type="text" v-model="staffSearch" placeholder="Search staff by name, email, or position...">
                <span class="search-icon">🔍</span>
              </div>
              <div class="filter-controls">
                <select v-model="statusFilter" class="filter-select">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
                <select v-model="departmentFilter" class="filter-select">
                  <option value="">All Departments</option>
                  <option v-for="dept in uniqueDepartments" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
            </div>
            
            <!-- Staff Table -->
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th @click="sortStaff('id')" class="sortable">
                      ID <span class="sort-icon">{{ sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕' }}</span>
                    </th>
                    <th @click="sortStaff('name')" class="sortable">
                      Staff Member <span class="sort-icon">{{ sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕' }}</span>
                    </th>
                    <th>Contact</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="staff in paginatedStaff" :key="staff.id">
                    <td>#{{ staff.id }}</td>
                    <td class="staff-info">
                      <div class="staff-avatar" :style="{ background: getAvatarColor(staff.name) }">
                        {{ getInitials(staff.name) }}
                      </div>
                      <div>
                        <div class="staff-name">{{ staff.name }}</div>
                        <div class="staff-email">{{ staff.email }}</div>
                      </div>
                    </td>
                    <td>
                      <div>{{ staff.phone || 'N/A' }}</div>
                      <small>{{ staff.joinDate }}</small>
                    </td>
                    <td>{{ staff.position }}</td>
                    <td>
                      <span class="department-badge">{{ staff.department }}</span>
                    </td>
                    <td>
                      <span class="status-badge" :class="staff.status.toLowerCase().replace(' ', '-')">
                        {{ staff.status }}
                      </span>
                    </td>
                    <td class="actions">
                      <button class="btn-icon edit" @click="openStaffForm(staff)" title="Edit">
                        ✏️
                      </button>
                      <button class="btn-icon view" @click="viewStaff(staff)" title="View Details">
                        👁️
                      </button>
                      <button class="btn-icon delete" @click="deleteStaff(staff.id)" title="Delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">← Previous</button>
              <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages">Next →</button>
            </div>
            
            <!-- Empty State -->
            <div v-if="filteredStaff.length === 0" class="empty-state">
              <div class="empty-icon">👥</div>
              <h3>No staff members found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          </div>
          
          <!-- Booking Management Section -->
          <div v-if="activeSection === 'bookings'" class="section">
            <div class="section-header">
              <h2>Booking Management</h2>
              <button class="btn-add" @click="newBooking">+ New Booking</button>
            </div>
            
            <!-- Booking Tabs -->
            <div class="tabs">
              <button :class="{ active: bookingTab === 'upcoming' }" @click="bookingTab = 'upcoming'">
                📅 Upcoming ({{ upcomingBookings.length }})
              </button>
              <button :class="{ active: bookingTab === 'active' }" @click="bookingTab = 'active'">
                ✅ Active ({{ activeBookings.length }})
              </button>
              <button :class="{ active: bookingTab === 'past' }" @click="bookingTab = 'past'">
                📋 Past ({{ pastBookings.length }})
              </button>
              <button :class="{ active: bookingTab === 'cancelled' }" @click="bookingTab = 'cancelled'">
                ❌ Cancelled ({{ cancelledBookings.length }})
              </button>
            </div>
            
            <!-- Bookings Table -->
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Villa</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in currentBookings" :key="booking.id">
                    <td>#{{ booking.id }}</td>
                    <td>
                      <div class="guest-info">
                        <strong>{{ booking.guestName }}</strong>
                        <small>{{ booking.guestEmail }}</small>
                      </div>
                    </td>
                    <td>{{ booking.villa }}</td>
                    <td>{{ formatDate(booking.checkIn) }}</td>
                    <td>{{ formatDate(booking.checkOut) }}</td>
                    <td>${{ booking.totalAmount }}</td>
                    <td>
                      <span class="status-badge" :class="booking.status.toLowerCase()">
                        {{ booking.status }}
                      </span>
                    </td>
                    <td class="actions">
                      <button class="btn-sm" @click="viewBooking(booking)">View</button>
                      <button class="btn-sm edit" @click="editBooking(booking)">Edit</button>
                      <button v-if="booking.status === 'Confirmed'" class="btn-sm success" @click="checkIn(booking)">
                        Check In
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Villa Management Section -->
          <div v-if="activeSection === 'villas'" class="section">
            <div class="section-header">
              <h2>Villa Management</h2>
              <button class="btn-add" @click="openVillaForm(null)">+ Add New Villa</button>
            </div>
            
            <!-- Villa Statistics -->
            <div class="villa-stats">
              <div class="stat-card small">
                <div class="stat-icon">🏠</div>
                <div class="stat-info">
                  <h4>Total Villas</h4>
                  <p class="stat-number">{{ villas.length }}</p>
                </div>
              </div>
              <div class="stat-card small">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                  <h4>Available</h4>
                  <p class="stat-number">{{ availableVillas }}</p>
                </div>
              </div>
              <div class="stat-card small">
                <div class="stat-icon">⏳</div>
                <div class="stat-info">
                  <h4>Occupied</h4>
                  <p class="stat-number">{{ occupiedVillas }}</p>
                </div>
              </div>
              <div class="stat-card small">
                <div class="stat-icon">🧹</div>
                <div class="stat-info">
                  <h4>Maintenance</h4>
                  <p class="stat-number">{{ maintenanceVillas }}</p>
                </div>
              </div>
            </div>
            
            <!-- Villa Grid -->
            <div class="villa-grid">
              <div v-for="villa in villas" :key="villa.id" class="villa-card" :class="villa.status">
                <div class="villa-image">
                  <img :src="villa.image" :alt="villa.name" @error="handleImageError">
                  <span class="villa-price">${{ villa.price }}/night</span>
                  <span class="villa-status" :class="villa.status">{{ villa.status }}</span>
                </div>
                <div class="villa-info">
                  <div class="villa-header">
                    <h3>{{ villa.name }}</h3>
                    <div class="villa-rating">⭐ {{ villa.rating }}</div>
                  </div>
                  <p class="villa-location">📍 {{ villa.location }}</p>
                  <div class="villa-details">
                    <span class="detail">🛏️ {{ villa.bedrooms }} Bedrooms</span>
                    <span class="detail">🛁 {{ villa.bathrooms }} Bathrooms</span>
                    <span class="detail">👥 {{ villa.capacity }} Guests</span>
                  </div>
                  <div class="villa-amenities">
                    <span v-for="(amenity, index) in villa.amenities.slice(0, 3)" :key="index" class="amenity">
                      {{ amenity }}
                    </span>
                    <span v-if="villa.amenities.length > 3" class="amenity-more">
                      +{{ villa.amenities.length - 3 }} more
                    </span>
                  </div>
                  <div class="villa-actions">
                    <button class="btn-sm" @click="viewVilla(villa)">View</button>
                    <button class="btn-sm edit" @click="openVillaForm(villa)">Edit</button>
                    <button class="btn-sm danger" @click="deleteVilla(villa.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Check In/Out Section -->
          <div v-if="activeSection === 'checkin'" class="section">
            <div class="section-header">
              <h2>Check In / Check Out</h2>
              <div class="header-actions">
                <button class="btn-secondary" @click="showCheckInForm = true">🔑 Check In</button>
                <button class="btn-secondary" @click="showCheckOutForm = true">🚪 Check Out</button>
              </div>
            </div>
            
            <!-- Today's Arrivals and Departures -->
            <div class="checkin-grid">
              <div class="arrivals-card">
                <h3>Today's Arrivals</h3>
                <div class="arrivals-list">
                  <div v-for="arrival in todaysArrivals" :key="arrival.id" class="arrival-item">
                    <div class="arrival-info">
                      <strong>{{ arrival.guestName }}</strong>
                      <small>Villa {{ arrival.villaNumber }}</small>
                    </div>
                    <div class="arrival-time">{{ arrival.checkInTime }}</div>
                    <button class="btn-sm success" @click="processCheckIn(arrival)">Check In</button>
                  </div>
                </div>
              </div>
              
              <div class="departures-card">
                <h3>Today's Departures</h3>
                <div class="departures-list">
                  <div v-for="departure in todaysDepartures" :key="departure.id" class="departure-item">
                    <div class="departure-info">
                      <strong>{{ departure.guestName }}</strong>
                      <small>Villa {{ departure.villaNumber }}</small>
                    </div>
                    <div class="departure-time">{{ departure.checkOutTime }}</div>
                    <button class="btn-sm" @click="processCheckOut(departure)">Check Out</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Currently Checked In -->
            <div class="current-guests">
              <h3>Currently Checked In</h3>
              <div class="guests-grid">
                <div v-for="guest in currentGuests" :key="guest.id" class="guest-card">
                  <div class="guest-avatar">{{ getInitials(guest.name) }}</div>
                  <div class="guest-info">
                    <h4>{{ guest.name }}</h4>
                    <p>Villa {{ guest.villa }}</p>
                    <small>Since {{ guest.checkInDate }}</small>
                  </div>
                  <div class="guest-actions">
                    <button class="btn-sm" @click="extendStay(guest)">Extend</button>
                    <button class="btn-sm warning" @click="earlyCheckOut(guest)">Early Check-out</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Payment Management Section -->
          <div v-if="activeSection === 'payments'" class="section">
            <div class="section-header">
              <h2>Payment Management</h2>
              <button class="btn-add" @click="recordPayment">+ Record Payment</button>
            </div>
            
            <!-- Payment Summary -->
            <div class="payment-summary">
              <div class="summary-card">
                <h3>Today's Collections</h3>
                <p class="amount">${{ todaysCollections }}</p>
              </div>
              <div class="summary-card">
                <h3>Pending Payments</h3>
                <p class="amount">${{ pendingPayments }}</p>
              </div>
              <div class="summary-card">
                <h3>Monthly Revenue</h3>
                <p class="amount">${{ monthlyRevenue }}</p>
              </div>
            </div>
            
            <!-- Payment Table -->
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Guest</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in payments" :key="payment.id">
                    <td>#{{ payment.id }}</td>
                    <td>{{ payment.guestName }}</td>
                    <td>${{ payment.amount }}</td>
                    <td>
                      <span class="payment-method" :class="payment.method.toLowerCase()">
                        {{ payment.method }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" :class="payment.status.toLowerCase()">
                        {{ payment.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(payment.date) }}</td>
                    <td>
                      <button class="btn-sm" @click="viewReceipt(payment)">Receipt</button>
                      <button v-if="payment.status === 'Pending'" class="btn-sm success" @click="markAsPaid(payment)">
                        Mark Paid
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Reports Section -->
          <div v-if="activeSection === 'reports'" class="section">
            <div class="section-header">
              <h2>Reports & Analytics</h2>
              <div class="header-actions">
                <button class="btn-export" @click="generateReport">📥 Generate Report</button>
                <button class="btn-export" @click="exportAllData">📊 Export All Data</button>
              </div>
            </div>
            
            <!-- Report Cards -->
            <div class="reports-grid">
              <div class="report-card">
                <h3>Occupancy Report</h3>
                <div class="report-content">
                  <p>Average Occupancy: <strong>{{ occupancyRate }}%</strong></p>
                  <p>Peak Season: <strong>{{ peakSeason }}</strong></p>
                  <button class="btn-view" @click="viewOccupancyReport">View Details</button>
                </div>
              </div>
              
              <div class="report-card">
                <h3>Revenue Report</h3>
                <div class="report-content">
                  <p>Total Revenue: <strong>${{ totalRevenue }}</strong></p>
                  <p>Growth: <strong :class="revenueGrowth >= 0 ? 'positive' : 'negative'">{{ revenueGrowth }}%</strong></p>
                  <button class="btn-view" @click="viewRevenueReport">View Details</button>
                </div>
              </div>
              
              <div class="report-card">
                <h3>Guest Report</h3>
                <div class="report-content">
                  <p>Total Guests: <strong>{{ totalGuests }}</strong></p>
                  <p>Repeat Guests: <strong>{{ repeatGuestsPercentage }}%</strong></p>
                  <button class="btn-view" @click="viewGuestReport">View Details</button>
                </div>
              </div>
              
              <div class="report-card">
                <h3>Staff Performance</h3>
                <div class="report-content">
                  <p>Average Rating: <strong>{{ averageStaffRating }}/5</strong></p>
                  <p>Top Performer: <strong>{{ topPerformer }}</strong></p>
                  <button class="btn-view" @click="viewStaffReport">View Details</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Settings Section -->
          <div v-if="activeSection === 'settings'" class="section">
            <div class="section-header">
              <h2>System Settings</h2>
            </div>
            
            <!-- Settings Tabs -->
            <div class="settings-tabs">
              <button :class="{ active: settingsTab === 'general' }" @click="settingsTab = 'general'">
                General
              </button>
              <button :class="{ active: settingsTab === 'villa' }" @click="settingsTab = 'villa'">
                Villa Settings
              </button>
              <button :class="{ active: settingsTab === 'payment' }" @click="settingsTab = 'payment'">
                Payment Settings
              </button>
              <button :class="{ active: settingsTab === 'notifications' }" @click="settingsTab = 'notifications'">
                Notifications
              </button>
            </div>
            
            <!-- General Settings -->
            <div v-if="settingsTab === 'general'" class="settings-form">
              <h3>General Settings</h3>
              <div class="form-group">
                <label>Business Name</label>
                <input type="text" v-model="settings.businessName" placeholder="Enter business name">
              </div>
              <div class="form-group">
                <label>Currency</label>
                <select v-model="settings.currency">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Time Zone</label>
                <select v-model="settings.timezone">
                  <option value="UTC-5">EST (UTC-5)</option>
                  <option value="UTC+0">GMT (UTC+0)</option>
                  <option value="UTC+8">SGT (UTC+8)</option>
                </select>
              </div>
              <button class="btn-save" @click="saveSettings">Save Settings</button>
            </div>
            
            <!-- Villa Settings -->
            <div v-if="settingsTab === 'villa'" class="settings-form">
              <h3>Villa Management Settings</h3>
              <div class="form-group">
                <label>Check-in Time</label>
                <input type="time" v-model="settings.checkInTime">
              </div>
              <div class="form-group">
                <label>Check-out Time</label>
                <input type="time" v-model="settings.checkOutTime">
              </div>
              <div class="form-group">
                <label>Minimum Stay (nights)</label>
                <input type="number" v-model="settings.minimumStay" min="1">
              </div>
              <button class="btn-save" @click="saveSettings">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Staff Form Modal -->
      <div v-if="showStaffModal" class="modal-overlay" @click.self="closeStaffForm">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingStaff ? 'Edit Staff Member' : 'Add New Staff Member' }}</h3>
            <button class="modal-close" @click="closeStaffForm">×</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" v-model="staffForm.name" placeholder="Enter full name" required>
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" v-model="staffForm.email" placeholder="Enter email address" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" v-model="staffForm.phone" placeholder="Enter phone number">
              </div>
              <div class="form-group">
                <label>Position *</label>
                <select v-model="staffForm.position" required>
                  <option value="">Select Position</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Manager">Manager</option>
                  <option value="Housekeeper">Housekeeper</option>
                  <option value="Chef">Chef</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Department *</label>
                <select v-model="staffForm.department" required>
                  <option value="">Select Department</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div class="form-group">
                <label>Join Date</label>
                <input type="date" v-model="staffForm.joinDate">
              </div>
            </div>
            <div class="form-group">
              <label>Status</label>
              <div class="status-options">
                <label class="status-option">
                  <input type="radio" v-model="staffForm.status" value="Active">
                  <span class="status-dot active"></span> Active
                </label>
                <label class="status-option">
                  <input type="radio" v-model="staffForm.status" value="Inactive">
                  <span class="status-dot inactive"></span> Inactive
                </label>
                <label class="status-option">
                  <input type="radio" v-model="staffForm.status" value="On Leave">
                  <span class="status-dot leave"></span> On Leave
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea v-model="staffForm.notes" placeholder="Additional notes..." rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeStaffForm">Cancel</button>
            <button class="btn-primary" @click="saveStaff">{{ editingStaff ? 'Update' : 'Add' }} Staff</button>
          </div>
        </div>
      </div>
      
      <!-- Villa Form Modal -->
      <div v-if="showVillaModal" class="modal-overlay" @click.self="closeVillaForm">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingVilla ? 'Edit Villa' : 'Add New Villa' }}</h3>
            <button class="modal-close" @click="closeVillaForm">×</button>
          </div>
          <div class="modal-body">
            <!-- Villa form content would go here -->
          </div>
        </div>
      </div>
      
      <!-- Toast Notifications -->
      <div class="toast-container">
        <div v-for="toast in toasts" :key="toast.id" 
             :class="['toast', toast.type]" 
             @click="removeToast(toast.id)">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Authentication State
const isLoggedIn = ref(false)
const email = ref('admin@villa.com')
const password = ref('admin123')
const error = ref('')
const userName = ref('Admin')
const userRole = ref('Administrator')

// UI State
const activeSection = ref('dashboard')
const sidebarCollapsed = ref(false)
const loading = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const dateRange = ref('today')
const bookingTab = ref('upcoming')
const settingsTab = ref('general')

// Modal States
const showStaffModal = ref(false)
const showVillaModal = ref(false)
const showCheckInForm = ref(false)
const showCheckOutForm = ref(false)

// Data States
const staffList = ref([])
const villas = ref([])
const bookings = ref([])
const payments = ref([])
const notifications = ref([])
const toasts = ref([])
const recentActivities = ref([])

// Search and Filter
const staffSearch = ref('')
const statusFilter = ref('')
const departmentFilter = ref('')
const sortConfig = ref({ key: 'id', direction: 'asc' })

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Settings
const settings = ref({
  businessName: 'Luxury Villa Resort',
  currency: 'USD',
  timezone: 'UTC-5',
  checkInTime: '14:00',
  checkOutTime: '11:00',
  minimumStay: 2
})

// Stats Data
const stats = ref({
  totalVillas: 12,
  activeBookings: 8,
  todaysGuests: 24,
  newArrivals: 5,
  todaysRevenue: 8420
})

// Form Data
const editingStaff = ref(null)
const staffForm = ref({
  name: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  status: 'Active',
  joinDate: new Date().toISOString().split('T')[0],
  notes: ''
})

const editingVilla = ref(null)

// Demo Data Initialization
const initializeDemoData = () => {
  // Staff Data
  staffList.value = [
    { id: 1, name: 'John Smith', email: 'john@villa.com', phone: '+1 (555) 123-4567', 
      position: 'General Manager', department: 'Management', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Maria Garcia', email: 'maria@villa.com', phone: '+1 (555) 123-4568',
      position: 'Receptionist', department: 'Front Desk', status: 'Active', joinDate: '2023-03-20' },
    { id: 3, name: 'David Lee', email: 'david@villa.com', phone: '+1 (555) 123-4569',
      position: 'Senior Housekeeper', department: 'Housekeeping', status: 'Active', joinDate: '2023-02-10' },
    { id: 4, name: 'Sarah Johnson', email: 'sarah@villa.com', phone: '+1 (555) 123-4570',
      position: 'Head Chef', department: 'Kitchen', status: 'Active', joinDate: '2023-04-05' },
    { id: 5, name: 'Robert Brown', email: 'robert@villa.com', phone: '+1 (555) 123-4571',
      position: 'Maintenance Supervisor', department: 'Maintenance', status: 'Active', joinDate: '2023-01-25' },
    { id: 6, name: 'Emma Wilson', email: 'emma@villa.com', phone: '+1 (555) 123-4572',
      position: 'Receptionist', department: 'Front Desk', status: 'On Leave', joinDate: '2023-05-15' },
    { id: 7, name: 'James Taylor', email: 'james@villa.com', phone: '+1 (555) 123-4573',
      position: 'Housekeeper', department: 'Housekeeping', status: 'Active', joinDate: '2023-06-01' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa@villa.com', phone: '+1 (555) 123-4574',
      position: 'Accountant', department: 'Management', status: 'Active', joinDate: '2023-03-10' }
  ]

  // Villa Data
  villas.value = [
    { id: 1, name: 'Ocean View Villa', location: 'Bali, Indonesia', price: 450,
      bedrooms: 3, bathrooms: 3, capacity: 6, status: 'available', rating: 4.8,
      amenities: ['Private Pool', 'Ocean View', 'WiFi', 'AC', 'Kitchen', 'Parking'],
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop' },
    { id: 2, name: 'Mountain Retreat', location: 'Swiss Alps', price: 380,
      bedrooms: 4, bathrooms: 3, capacity: 8, status: 'occupied', rating: 4.9,
      amenities: ['Fireplace', 'Sauna', 'Mountain View', 'WiFi', 'Jacuzzi'],
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop' },
    { id: 3, name: 'Beachfront Paradise', location: 'Maldives', price: 620,
      bedrooms: 5, bathrooms: 4, capacity: 10, status: 'available', rating: 4.7,
      amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Butler Service', 'Gym'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop' },
    { id: 4, name: 'City Penthouse', location: 'New York, USA', price: 550,
      bedrooms: 3, bathrooms: 2, capacity: 6, status: 'maintenance', rating: 4.6,
      amenities: ['City View', 'Rooftop Terrace', 'Concierge', 'Gym', 'Parking'],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop' },
    { id: 5, name: 'Forest Cabin', location: 'Canada', price: 320,
      bedrooms: 2, bathrooms: 1, capacity: 4, status: 'available', rating: 4.5,
      amenities: ['Forest View', 'Fireplace', 'Hiking Trails', 'WiFi', 'BBQ'],
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop' },
    { id: 6, name: 'Desert Oasis', location: 'Dubai, UAE', price: 680,
      bedrooms: 6, bathrooms: 5, capacity: 12, status: 'occupied', rating: 4.9,
      amenities: ['Private Pool', 'Desert View', 'Spa', 'Chef Service', 'Cinema'],
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop' }
  ]

  // Booking Data
  bookings.value = [
    { id: 1, guestName: 'Michael Chen', guestEmail: 'michael@example.com', villa: 'Ocean View Villa',
      checkIn: '2024-01-15', checkOut: '2024-01-20', totalAmount: 2250, status: 'Confirmed' },
    { id: 2, guestName: 'Sophia Rodriguez', guestEmail: 'sophia@example.com', villa: 'Mountain Retreat',
      checkIn: '2024-01-14', checkOut: '2024-01-18', totalAmount: 1520, status: 'Checked In' },
    { id: 3, guestName: 'Thomas Wilson', guestEmail: 'thomas@example.com', villa: 'Beachfront Paradise',
      checkIn: '2024-01-16', checkOut: '2024-01-22', totalAmount: 3720, status: 'Confirmed' },
    { id: 4, guestName: 'Emma Thompson', guestEmail: 'emma@example.com', villa: 'City Penthouse',
      checkIn: '2024-01-12', checkOut: '2024-01-15', totalAmount: 1650, status: 'Checked Out' },
    { id: 5, guestName: 'David Kim', guestEmail: 'david@example.com', villa: 'Forest Cabin',
      checkIn: '2024-01-18', checkOut: '2024-01-21', totalAmount: 960, status: 'Confirmed' }
  ]

  // Payment Data
  payments.value = [
    { id: 1, guestName: 'Michael Chen', amount: 2250, method: 'Credit Card', status: 'Paid', date: '2024-01-10' },
    { id: 2, guestName: 'Sophia Rodriguez', amount: 1520, method: 'Bank Transfer', status: 'Paid', date: '2024-01-09' },
    { id: 3, guestName: 'Thomas Wilson', amount: 1860, method: 'Credit Card', status: 'Pending', date: '2024-01-11' },
    { id: 4, guestName: 'Emma Thompson', amount: 1650, method: 'Cash', status: 'Paid', date: '2024-01-08' },
    { id: 5, guestName: 'David Kim', amount: 960, method: 'Credit Card', status: 'Paid', date: '2024-01-12' }
  ]

  // Notifications
  notifications.value = [
    { id: 1, type: 'success', title: 'New Booking', message: 'New booking confirmed for Villa #3', time: '5 min ago' },
    { id: 2, type: 'info', title: 'Check-in Reminder', message: 'Guest check-in at 2:00 PM for Villa #1', time: '1 hour ago' },
    { id: 3, type: 'warning', title: 'Maintenance', message: 'Villa #4 requires maintenance', time: '2 hours ago' },
    { id: 4, type: 'success', title: 'Payment Received', message: 'Payment of $2,250 received', time: '3 hours ago' }
  ]

  // Recent Activities
  recentActivities.value = [
    { id: 1, icon: '🏠', title: 'New Villa Added', description: 'Luxury Villa #15 has been added to the system', time: '10 min ago' },
    { id: 2, icon: '👤', title: 'Guest Checked In', description: 'John Doe checked into Villa 3', time: '30 min ago' },
    { id: 3, icon: '💰', title: 'Payment Received', description: 'Payment of $2,500 received for Booking #456', time: '1 hour ago' },
    { id: 4, icon: '📅', title: 'Booking Confirmed', description: 'New booking confirmed for Villa 7', time: '2 hours ago' },
    { id: 5, icon: '🧹', title: 'Cleaning Completed', description: 'Villa 2 cleaning completed', time: '3 hours ago' }
  ]
}

// Computed Properties

// Staff
const activeStaffCount = computed(() => 
  staffList.value.filter(staff => staff.status === 'Active').length
)

const uniqueDepartments = computed(() => {
  const depts = staffList.value.map(staff => staff.department)
  return [...new Set(depts)]
})

const filteredStaff = computed(() => {
  return staffList.value.filter(staff => {
    const matchesSearch = !staffSearch.value || 
      staff.name.toLowerCase().includes(staffSearch.value.toLowerCase()) ||
      staff.email.toLowerCase().includes(staffSearch.value.toLowerCase()) ||
      staff.position.toLowerCase().includes(staffSearch.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || staff.status === statusFilter.value
    const matchesDept = !departmentFilter.value || staff.department === departmentFilter.value
    
    return matchesSearch && matchesStatus && matchesDept
  })
})

const sortedStaff = computed(() => {
  const staff = [...filteredStaff.value]
  return staff.sort((a, b) => {
    const aVal = a[sortConfig.value.key]
    const bVal = b[sortConfig.value.key]
    
    if (sortConfig.value.direction === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
})

const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedStaff.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => 
  Math.ceil(filteredStaff.value.length / itemsPerPage)
)

// Villas
const availableVillas = computed(() => 
  villas.value.filter(villa => villa.status === 'available').length
)

const occupiedVillas = computed(() => 
  villas.value.filter(villa => villa.status === 'occupied').length
)

const maintenanceVillas = computed(() => 
  villas.value.filter(villa => villa.status === 'maintenance').length
)

// Bookings
const upcomingBookings = computed(() => 
  bookings.value.filter(b => b.status === 'Confirmed')
)

const activeBookings = computed(() => 
  bookings.value.filter(b => b.status === 'Checked In')
)

const pastBookings = computed(() => 
  bookings.value.filter(b => b.status === 'Checked Out')
)

const cancelledBookings = computed(() => 
  bookings.value.filter(b => b.status === 'Cancelled')
)

const currentBookings = computed(() => {
  switch(bookingTab.value) {
    case 'upcoming': return upcomingBookings.value
    case 'active': return activeBookings.value
    case 'past': return pastBookings.value
    case 'cancelled': return cancelledBookings.value
    default: return upcomingBookings.value
  }
})

// Check-in/out
const todaysArrivals = computed(() => [
  { id: 1, guestName: 'Michael Chen', villaNumber: '3', checkInTime: '2:00 PM' },
  { id: 2, guestName: 'Sarah Johnson', villaNumber: '1', checkInTime: '3:30 PM' },
  { id: 3, guestName: 'Robert Kim', villaNumber: '5', checkInTime: '4:00 PM' }
])

const todaysDepartures = computed(() => [
  { id: 1, guestName: 'Emma Wilson', villaNumber: '2', checkOutTime: '11:00 AM' },
  { id: 2, guestName: 'David Brown', villaNumber: '6', checkOutTime: '11:00 AM' }
])

const currentGuests = computed(() => [
  { id: 1, name: 'Sophia Rodriguez', villa: '1', checkInDate: '2024-01-14' },
  { id: 2, name: 'James Taylor', villa: '4', checkInDate: '2024-01-13' },
  { id: 3, name: 'Lisa Anderson', villa: '6', checkInDate: '2024-01-12' }
])

// Payments
const todaysCollections = computed(() => 8420)
const pendingPayments = computed(() => 1860)
const monthlyRevenue = computed(() => 125000)

// Reports
const occupancyRate = computed(() => 78)
const peakSeason = computed(() => 'December')
const totalRevenue = computed(() => 125000)
const revenueGrowth = computed(() => 12.5)
const totalGuests = computed(() => 245)
const repeatGuestsPercentage = computed(() => 35)
const averageStaffRating = computed(() => 4.7)
const topPerformer = computed(() => 'Maria Garcia')

// Other computed
const unreadNotifications = computed(() => notifications.value.length)
const getUserInitials = computed(() => userName.value.split(' ').map(n => n[0]).join('').toUpperCase())

// Chart Data
const occupancyData = computed(() => [
  { day: 'Mon', percentage: 65 },
  { day: 'Tue', percentage: 72 },
  { day: 'Wed', percentage: 78 },
  { day: 'Thu', percentage: 85 },
  { day: 'Fri', percentage: 92 },
  { day: 'Sat', percentage: 95 },
  { day: 'Sun', percentage: 88 }
])

const revenueData = computed(() => [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 65 },
  { month: 'May', value: 58 },
  { month: 'Jun', value: 72 }
])

// Methods

// Authentication
const login = () => {
  error.value = ''
  loading.value = true
  
  // Demo authentication
  setTimeout(() => {
    const validUsers = {
      'admin@villa.com': { password: 'admin123', name: 'Admin', role: 'Administrator' },
      'manager@villa.com': { password: 'manager123', name: 'Manager', role: 'Manager' },
      'staff@villa.com': { password: 'staff123', name: 'Staff', role: 'Staff' }
    }
    
    if (validUsers[email.value] && validUsers[email.value].password === password.value) {
      isLoggedIn.value = true
      userName.value = validUsers[email.value].name
      userRole.value = validUsers[email.value].role
      initializeDemoData()
      showToast('Login successful!', 'success')
    } else {
      error.value = 'Invalid email or password'
      showToast('Invalid credentials', 'error')
    }
    loading.value = false
  }, 1000)
}

const logout = () => {
  isLoggedIn.value = false
  email.value = 'admin@villa.com'
  password.value = 'admin123'
  activeSection.value = 'dashboard'
  showToast('Logged out successfully', 'info')
}

// UI Navigation
const setActiveSection = (section) => {
  activeSection.value = section
  sidebarCollapsed.value = false
}

// Staff Management
const departmentCount = (dept) => 
  staffList.value.filter(staff => staff.department === dept).length

const getInitials = (name) => 
  name.split(' ').map(n => n[0]).join('').toUpperCase()

const getAvatarColor = (name) => {
  const colors = ['#667eea', '#764ba2', '#f56565', '#ed8936', '#48bb78', '#4299e1']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const openStaffForm = (staff) => {
  if (staff) {
    editingStaff.value = staff
    staffForm.value = { ...staff }
  } else {
    editingStaff.value = null
    staffForm.value = {
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      notes: ''
    }
  }
  showStaffModal.value = true
}

const closeStaffForm = () => {
  showStaffModal.value = false
  editingStaff.value = null
}

const saveStaff = () => {
  if (!staffForm.value.name || !staffForm.value.email || !staffForm.value.position || !staffForm.value.department) {
    showToast('Please fill all required fields', 'error')
    return
  }
  
  if (editingStaff.value) {
    const index = staffList.value.findIndex(s => s.id === editingStaff.value.id)
    if (index !== -1) {
      staffList.value[index] = { ...staffForm.value, id: editingStaff.value.id }
      showToast('Staff updated successfully', 'success')
    }
  } else {
    const newId = Math.max(...staffList.value.map(s => s.id)) + 1
    staffList.value.push({ ...staffForm.value, id: newId })
    showToast('Staff added successfully', 'success')
  }
  
  closeStaffForm()
}

const deleteStaff = (id) => {
  if (confirm('Are you sure you want to delete this staff member?')) {
    staffList.value = staffList.value.filter(s => s.id !== id)
    showToast('Staff deleted successfully', 'success')
  }
}

const sortStaff = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
}

// Pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Villa Management
const openVillaForm = (villa) => {
  editingVilla.value = villa
  showVillaModal.value = true
}

const closeVillaForm = () => {
  showVillaModal.value = false
  editingVilla.value = null
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU1RTUiLz48cGF0aCBkPSJNMjAwIDE1MEMyMzIuMDQ4IDE1MCAyNTggMTIzLjA0OCAyNTggOTFDMjU4IDU4Ljk1MTYgMjMyLjA0OCAzMiAyMDAgMzJDMTY3Ljk1MiAzMiAxNDIgNTguOTUxNiAxNDIgOTFDMTQyIDEyMy4wNDggMTY3Ljk1MiAxNTAgMjAwIDE1MFoiIGZpbGw9IiNDQ0NDQ0Mi8vPjxwYXRoIGQ9Ik0xMDAgMjAwSDEwLjVDMTQuOTgwMiAyMDAgMjAwIDIwMCAyMDAgMjAwVjI1MEMyMDAgMjY1LjIyMyAxODcuMjIzIDI4MCAxNzAgMjgwSDEwMEM4Mi43NzI1IDI4MCA3MCAyNjUuMjIzIDcwIDI1MFYyMzBDNzAgMjE0Ljc3NyA4Mi43NzI1IDIwMCAxMDAgMjAwWiIgZmlsbD0iI0NDQ0NDQyIvPjxwYXRoIGQ9Ik0zMDAgMjAwSDM5MC41QzM4NS4wMTggMjAwIDMwMCAyMDAgMzAwIDIwMFYyNTBDMzAwIDI2NS4yMjMgMzEyLjc3MyAyODAgMzMwIDI4MEgzMDBDMjgyLjc3MyAyODAgMjcwIDI2NS4yMjMgMjcwIDI1MFYyMzBDMjcwIDIxNC43NzcgMjgyLjc3MyAyMDAgMzAwIDIwMFoiIGZpbGw9IiNDQ0NDQ0MiLz48L3N2Zz4='
}

// Booking Management
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Check In/Out
const processCheckIn = (arrival) => {
  showToast(`Checked in ${arrival.guestName} to Villa ${arrival.villaNumber}`, 'success')
}

const processCheckOut = (departure) => {
  showToast(`Checked out ${departure.guestName} from Villa ${departure.villaNumber}`, 'success')
}

// Notifications
const markAsRead = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const markAllAsRead = () => {
  notifications.value = []
}

// Toast Notifications
const showToast = (message, type = 'info') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  
  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

// User Menu
const viewProfile = () => {
  showToast('Profile page coming soon!', 'info')
}

const changePassword = () => {
  showToast('Change password feature coming soon!', 'info')
}

// Settings
const saveSettings = () => {
  showToast('Settings saved successfully', 'success')
}

// Reports
const generateReport = () => {
  showToast('Report generated successfully', 'success')
}

const exportAllData = () => {
  showToast('Data exported successfully', 'success')
}

// Watch for filter changes to reset pagination
watch([staffSearch, statusFilter, departmentFilter], () => {
  currentPage.value = 1
})

// Initialize on mount
onMounted(() => {
  if (isLoggedIn.value) {
    initializeDemoData()
  }
})
</script>

<style>
/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
  color: #333;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
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
  position: relative;
  overflow: hidden;
}

.login-screen::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%);
  animation: pulse 20s infinite linear;
}

@keyframes pulse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.login-container {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
  background: #f8fafc;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #e53e3e;
  margin: 10px 0;
  text-align: center;
  padding: 10px;
  background: #fed7d7;
  border-radius: 8px;
  border: 1px solid #fc8181;
}

.btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn:active {
  transform: translateY(0);
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
  display: block;
  margin-bottom: 8px;
}

.demo-info p {
  margin: 5px 0;
  padding: 5px 10px;
  background: #f7fafc;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

/* Dashboard */
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Dashboard Header */
.dashboard-header {
  background: white;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hamburger {
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s;
}

.hamburger:hover {
  background: #f7fafc;
}

.header-left h1 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 2px;
}

.header-left p {
  color: #666;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Notifications */
.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 10px;
  font-size: 20px;
  border-radius: 8px;
  transition: background 0.3s;
}

.notification-bell:hover {
  background: #f7fafc;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e53e3e;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  margin-top: 10px;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.notifications-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-header h4 {
  color: #333;
  font-size: 1.1rem;
}

.mark-all-read {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}

.empty-notifications {
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f7fafc;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  transition: background 0.3s;
}

.notification-item:hover {
  background: #f7fafc;
}

.notification-item.success {
  border-left: 4px solid #48bb78;
}

.notification-item.info {
  border-left: 4px solid #4299e1;
}

.notification-item.warning {
  border-left: 4px solid #ed8936;
}

.notification-content {
  flex: 1;
}

.notification-content strong {
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.notification-content p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.notification-content small {
  color: #999;
  font-size: 0.8rem;
}

.notification-close {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  padding: 0 5px;
}

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 15px;
  background: #f7fafc;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;
  position: relative;
}

.user-menu:hover {
  background: #edf2f7;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.user-role {
  color: #666;
  font-size: 0.8rem;
}

.dropdown-arrow {
  color: #666;
  font-size: 12px;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  margin-top: 10px;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.dropdown-item {
  padding: 15px 20px;
  color: #333;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-item:hover {
  background: #f7fafc;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 5px 0;
}

.dropdown-item.logout {
  color: #e53e3e;
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 70px);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #1a202c;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar nav {
  flex: 1;
  padding: 30px 0;
}

.sidebar ul {
  list-style: none;
}

.sidebar li {
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 15px;
  white-space: nowrap;
}

.sidebar li:hover {
  background: rgba(255,255,255,0.1);
}

.sidebar li.active {
  background: #667eea;
  position: relative;
}

.sidebar li.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: white;
}

.sidebar .icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.sidebar .text {
  font-size: 0.95rem;
  font-weight: 500;
}

.sidebar.collapsed .text {
  display: none;
}

.system-status {
  padding: 20px 25px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #a0aec0;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #48bb78;
}

.status-indicator.online {
  background: #48bb78;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 30px;
  background: #f7fafc;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-content.expanded {
  margin-left: -180px;
}

/* Section */
.section {
  animation: fadeIn 0.3s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

.date-range select {
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
}

.stat-card.small {
  padding: 20px;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  background: #f7fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.small .stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
}

.stat-info {
  flex: 1;
}

.stat-info h4 {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 0.85rem;
  color: #666;
}

.stat-change.positive {
  color: #48bb78;
  font-weight: 500;
}

/* Charts Container */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.chart-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.chart-wrapper {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding: 20px 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 15px;
  flex: 1;
  height: 100%;
}

.chart-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar {
  width: 40px;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: height 1s ease;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.bar-label {
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
}

.revenue-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 150px;
  padding: 20px 0;
}

.revenue-month {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.month-bar {
  width: 30px;
  background: linear-gradient(to top, #48bb78, #38a169);
  border-radius: 6px 6px 0 0;
  transition: height 1s ease;
}

.month-label {
  color: #666;
  font-size: 0.9rem;
}

.month-amount {
  font-size: 0.8rem;
  color: #333;
  font-weight: 600;
}

/* Quick Actions */
.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  margin-bottom: 30px;
}

.quick-actions h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  padding: 20px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.1);
}

.action-icon {
  font-size: 2rem;
}

.action-text {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

/* Recent Activity */
.recent-activity {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.activity-header h3 {
  color: #333;
  font-size: 1.2rem;
}

.refresh-btn {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: #edf2f7;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 12px;
  transition: background 0.3s;
}

.activity-item:hover {
  background: #edf2f7;
}

.activity-icon {
  font-size: 1.5rem;
  width: 45px;
  height: 45px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.activity-desc {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 5px;
}

.activity-time {
  color: #999;
  font-size: 0.85rem;
}

/* Staff Management */
.staff-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
  background: white;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.1rem;
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Table Responsive */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.data-table {
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border-collapse: collapse;
}

.data-table th {
  background: #f7fafc;
  padding: 15px 20px;
  text-align: left;
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-icon {
  margin-left: 5px;
  font-size: 0.8rem;
}

.data-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #edf2f7;
  color: #333;
}

.data-table tr:hover td {
  background: #f7fafc;
}

/* Staff Info in Table */
.staff-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.staff-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.staff-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.staff-email {
  color: #666;
  font-size: 0.85rem;
}

/* Department Badge */
.department-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #e6fffa;
  color: #234e52;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.inactive {
  background: #fed7d7;
  color: #742a2a;
}

.status-badge.on-leave {
  background: #feebc8;
  color: #744210;
}

.status-badge.confirmed {
  background: #bee3f8;
  color: #2c5282;
}

.status-badge.checked-in {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.checked-out {
  background: #e2e8f0;
  color: #4a5568;
}

.status-badge.cancelled {
  background: #fed7d7;
  color: #742a2a;
}

.status-badge.paid {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.pending {
  background: #feebc8;
  color: #744210;
}

/* Actions in Table */
.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon.edit {
  background: #bee3f8;
  color: #2c5282;
}

.btn-icon.view {
  background: #c6f6d5;
  color: #22543d;
}

.btn-icon.delete {
  background: #fed7d7;
  color: #742a2a;
}

.btn-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.btn-sm {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-sm:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.btn-sm.success {
  background: #48bb78;
  color: white;
}

.btn-sm.warning {
  background: #ed8936;
  color: white;
}

.btn-sm.danger {
  background: #f56565;
  color: white;
}

.btn-sm.edit {
  background: #4299e1;
  color: white;
}

/* Buttons */
.btn-add, .btn-export, .btn-secondary, .btn-save, .btn-primary {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-export {
  background: #48bb78;
  color: white;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-save, .btn-primary {
  background: #667eea;
  color: white;
}

.btn-add:hover, .btn-export:hover, .btn-secondary:hover, .btn-save:hover, .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
}

.pagination button {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 0.95rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

/* Villa Grid */
.villa-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-top: 25px;
}

.villa-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  transition: all 0.3s;
  position: relative;
}

.villa-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.villa-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.villa-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.villa-card:hover .villa-image img {
  transform: scale(1.05);
}

.villa-price {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.villa-status {
  position: absolute;
  bottom: 15px;
  left: 15px;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.villa-status.available {
  background: #48bb78;
}

.villa-status.occupied {
  background: #ed8936;
}

.villa-status.maintenance {
  background: #f56565;
}

.villa-info {
  padding: 25px;
}

.villa-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.villa-header h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
}

.villa-rating {
  background: #feebc8;
  color: #744210;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.villa-location {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.villa-details {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.detail {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.villa-amenities {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.amenity {
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.amenity-more {
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.villa-actions {
  display: flex;
  gap: 10px;
}

/* Check-in/Out Grid */
.checkin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.arrivals-card, .departures-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.arrivals-card h3, .departures-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.arrivals-list, .departures-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.arrival-item, .departure-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: #f7fafc;
  border-radius: 10px;
  transition: background 0.3s;
}

.arrival-item:hover, .departure-item:hover {
  background: #edf2f7;
}

.arrival-info, .departure-info {
  flex: 1;
}

.arrival-info strong, .departure-info strong {
  display: block;
  color: #333;
  margin-bottom: 5px;
}

.arrival-info small, .departure-info small {
  color: #666;
  font-size: 0.85rem;
}

.arrival-time, .departure-time {
  color: #666;
  font-weight: 500;
  margin-right: 20px;
}

/* Current Guests */
.current-guests {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.current-guests h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.guests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.guest-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s;
}

.guest-card:hover {
  background: #edf2f7;
  transform: translateX(5px);
}

.guest-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.guest-info {
  flex: 1;
}

.guest-info h4 {
  color: #333;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.guest-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.guest-info small {
  color: #999;
  font-size: 0.85rem;
}

.guest-actions {
  display: flex;
  gap: 10px;
}

/* Payment Summary */
.payment-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  text-align: center;
}

.summary-card h3 {
  color: #666;
  font-size: 1rem;
  margin-bottom: 15px;
  font-weight: 500;
}

.summary-card .amount {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.payment-method {
  display: inline-block;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.payment-method.credit-card {
  background: #c6f6d5;
  color: #22543d;
}

.payment-method.bank-transfer {
  background: #bee3f8;
  color: #2c5282;
}

.payment-method.cash {
  background: #feebc8;
  color: #744210;
}

/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.report-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.report-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.report-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.report-content p {
  color: #666;
  font-size: 0.95rem;
}

.report-content strong {
  color: #333;
  font-weight: 600;
}

.report-content .positive {
  color: #48bb78;
}

.report-content .negative {
  color: #f56565;
}

.btn-view {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  align-self: flex-start;
}

.btn-view:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Settings Tabs */
.settings-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
}

.settings-tabs button {
  padding: 12px 25px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
  position: relative;
}

.settings-tabs button.active {
  color: #667eea;
  background: #ebf4ff;
}

.settings-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  right: 0;
  height: 3px;
  background: #667eea;
  border-radius: 3px 3px 0 0;
}

.settings-form {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  max-width: 600px;
}

.settings-form h3 {
  color: #333;
  margin-bottom: 25px;
  font-size: 1.3rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlide 0.3s ease;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 20px 20px 0 0;
}

.modal-header h3 {
  color: #333;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #f7fafc;
  color: #333;
}

.modal-body {
  padding: 30px;
}

.modal-footer {
  padding: 25px 30px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background: #f7fafc;
  border-radius: 0 0 20px 20px;
}

/* Form Rows in Modal */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s;
  background: #f8fafc;
}

.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Status Options in Modal */
.status-options {
  display: flex;
  gap: 25px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 10px;
  transition: background 0.3s;
}

.status-option:hover {
  background: #f7fafc;
}

.status-option input[type="radio"] {
  display: none;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.active {
  background: #48bb78;
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.2);
}

.status-dot.inactive {
  background: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.2);
}

.status-dot.leave {
  background: #ed8936;
  box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.2);
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 350px;
}

.toast {
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  cursor: pointer;
  animation: toastSlide 0.3s ease;
  position: relative;
  overflow: hidden;
  border-left: 5px solid #4299e1;
}

@keyframes toastSlide {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #4299e1;
  animation: toastProgress 3s linear;
}

@keyframes toastProgress {
  from { width: 100%; }
  to { width: 0%; }
}

.toast.success {
  border-left-color: #48bb78;
}

.toast.success::before {
  background: #48bb78;
}

.toast.error {
  border-left-color: #e53e3e;
}

.toast.error::before {
  background: #e53e3e;
}

.toast.info {
  border-left-color: #4299e1;
}

.toast.info::before {
  background: #4299e1;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  margin-top: 20px;
  color: #666;
  font-size: 1.1rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 12px 25px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .checkin-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .sidebar.collapsed {
    width: 100%;
    height: 60px;
  }
  
  .sidebar.collapsed nav {
    display: none;
  }
  
  .main-content.expanded {
    margin-left: 0;
  }
  
  .sidebar nav ul {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  
  .sidebar li {
    flex-direction: column;
    padding: 10px 15px;
    text-align: center;
  }
  
  .sidebar .text {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 0 15px;
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }
  
  .header-left, .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: 100%;
  }
  
  .villa-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
    margin: 10px;
  }
  
  .notifications-dropdown {
    width: 300px;
    right: -50px;
  }
  
  .user-dropdown {
    right: -50px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 25px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .sidebar li {
    padding: 8px 12px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .btn-add, .btn-export, .btn-secondary, .btn-save, .btn-primary {
    width: 100%;
    justify-content: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .toast-container {
    left: 15px;
    right: 15px;
    bottom: 15px;
    max-width: none;
  }
}

/* Print Styles */
@media print {
  .login-screen,
  .dashboard-header,
  .sidebar,
  .btn-add,
  .btn-export,
  .btn-secondary,
  .actions,
  .modal-overlay,
  .toast-container {
    display: none !important;
  }
  
  .dashboard-content {
    margin: 0;
    padding: 0;
  }
  
  .main-content {
    background: white;
    box-shadow: none;
  }
  
  .section {
    break-inside: avoid;
  }
  
  .data-table {
    border: 1px solid #333;
  }
  
  .stat-card {
    border: 1px solid #ddd;
    box-shadow: none;
  }
}
</style>