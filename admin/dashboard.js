// Admin Dashboard JavaScript - Uses API
console.log('📊 Admin Dashboard Loading...');

// Dynamic API Base
const API_BASE = window.location.origin;

// Auth check
function checkAuth() {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'index.html';
    }
}

// Listen for messages from orders page to refresh stats
window.addEventListener('message', (event) => {
    if (event.data.action === 'refreshStats') {
        console.log('📊 Refreshing stats after order deletion...');
        loadDashboard();
    }
});

// Load Dashboard Stats
async function loadDashboard() {
    try {
        console.log('📥 Loading dashboard data from real APIs...');

        // Fetch orders from the same endpoint used by orders page
        const ordersResponse = await fetch(`${API_BASE}/api/orders`);
        const allOrders = await ordersResponse.json();

        // Fetch users from the same endpoint used by users page
        const usersResponse = await fetch(`${API_BASE}/api/profiles`);
        const allUsers = await usersResponse.json();

        console.log(`📦 Loaded ${allOrders.length} orders, ${allUsers.length} users`);

        // Calculate stats from real data
        const today = new Date().toDateString();
        const todayOrders = allOrders.filter(o => new Date(o.createdAt).toDateString() === today);
        const pendingOrders = allOrders.filter(o => o.status === 'pending_verification');
        const completedOrders = allOrders.filter(o => o.status === 'completed');
        const processingOrders = allOrders.filter(o => o.status === 'processing');

        // Calculate revenue
        const totalRevenue = allOrders.reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);
        const avgOrderValue = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

        // Build stats object
        const stats = {
            totalOrders: allOrders.length,
            todayOrders: todayOrders.length,
            pendingOrders: pendingOrders.length,
            totalRevenue: totalRevenue,
            totalUsers: allUsers.length,
            completedOrders: completedOrders.length,
            processingOrders: processingOrders.length,
            avgOrderValue: avgOrderValue
        };

        // Display stats
        displayStats(stats);

        // Display recent orders
        displayRecentOrders(allOrders);

    } catch (error) {
        console.error('❌ Error loading dashboard:', error);
        showDashboardError();
    }
}

function showDashboardError() {
    console.error('Failed to load dashboard data. Check if backend is running.');
    // Set all stats to 0 as fallback
    const emptyStats = {
        totalOrders: 0,
        todayOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        completedOrders: 0,
        processingOrders: 0,
        avgOrderValue: 0
    };
    displayStats(emptyStats);
}

function displayStats(stats) {
    document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
    document.getElementById('todayOrders').textContent = stats.todayOrders || 0;
    document.getElementById('pendingOrders').textContent = stats.pendingOrders || 0;
    document.getElementById('totalRevenue').textContent = `₹${(stats.totalRevenue || 0).toLocaleString()}`;
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('completedOrders').textContent = stats.completedOrders || 0;
    document.getElementById('processingOrders').textContent = stats.processingOrders || 0;
    document.getElementById('avgOrderValue').textContent = `₹${(stats.avgOrderValue || 0).toLocaleString()}`;
}

function displayRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <div>No orders yet</div>
                </td>
            </tr>
        `;
        return;
    }

    // Sort by date (newest first) and take last 10
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

    tbody.innerHTML = recentOrders.map(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);

        return `
            <tr>
                <td><strong>#${order.orderId || 'N/A'}</strong></td>
                <td><strong>@${order.profileUsername || 'Unknown User'}</strong></td>
                <td><strong style="color: #EC4899;">@${order.username || 'NOT PROVIDED'}</strong></td>
                <td>${order.packageName} (${order.followers})</td>
                <td><strong>₹${order.amount}</strong></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${date}</td>
                <td>
                    <a href="orders.html?id=${order.orderId}" class="btn-action">View</a>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusClass(status) {
    const classes = {
        'pending_verification': 'status-pending',
        'processing': 'status-processing',
        'completed': 'status-completed'
    };
    return classes[status] || 'status-pending';
}

function getStatusText(status) {
    const texts = {
        'pending_verification': 'Pending',
        'processing': 'Processing',
        'completed': 'Completed'
    };
    return texts[status] || status;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        window.location.href = 'index.html';
    }
}

// Set current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Initialize
loadDashboard();

// Refresh every 10 seconds
setInterval(loadDashboard, 10000);

console.log('✅ Dashboard loaded');
