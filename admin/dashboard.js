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
        console.log('📥 Loading dashboard data from APIs...');
        console.log('🌐 API Base:', API_BASE);

        // Fetch orders - EXACT same pattern as orders.js
        console.log('🔄 Fetching orders from:', `${API_BASE}/api/orders`);
        const ordersResponse = await fetch(`${API_BASE}/api/orders`);

        if (!ordersResponse.ok) {
            throw new Error(`Orders API failed: ${ordersResponse.status} ${ordersResponse.statusText}`);
        }

        const allOrders = await ordersResponse.json();
        console.log('📦 Orders API Response:', allOrders);
        console.log('📦 Orders type:', typeof allOrders, 'Is array:', Array.isArray(allOrders));
        console.log('📦 Orders count:', Array.isArray(allOrders) ? allOrders.length : 'NOT AN ARRAY');

        // Fetch users - EXACT same pattern as users.html  
        console.log('🔄 Fetching profiles from:', `${API_BASE}/api/profiles`);
        const profilesResponse = await fetch(`${API_BASE}/api/profiles`);

        if (!profilesResponse.ok) {
            throw new Error(`Profiles API failed: ${profilesResponse.status} ${profilesResponse.statusText}`);
        }

        const allProfiles = await profilesResponse.json();
        console.log('👥 Profiles API Response:', allProfiles);
        console.log('👥 Profiles type:', typeof allProfiles, 'Is array:', Array.isArray(allProfiles));
        console.log('👥 Profiles count:', Array.isArray(allProfiles) ? allProfiles.length : 'NOT AN ARRAY');

        // Ensure we have arrays
        if (!Array.isArray(allOrders)) {
            console.error('❌ Orders response is not an array!', allOrders);
            throw new Error('Invalid orders response format');
        }

        if (!Array.isArray(allProfiles)) {
            console.error('❌ Profiles response is not an array!', allProfiles);
            throw new Error('Invalid profiles response format');
        }

        console.log(`✅ Successfully loaded ${allOrders.length} orders and ${allProfiles.length} profiles`);

        // Calculate stats from real data - same logic as orders.js filters
        const today = new Date().toDateString();

        const todayOrders = allOrders.filter(o => {
            return o.createdAt && new Date(o.createdAt).toDateString() === today;
        });

        const pendingOrders = allOrders.filter(o => o.status === 'pending_verification');
        const completedOrders = allOrders.filter(o => o.status === 'completed');
        const processingOrders = allOrders.filter(o => o.status === 'processing');

        // Calculate revenue - handle missing/invalid amounts
        const totalRevenue = allOrders.reduce((sum, order) => {
            const amount = parseFloat(order.amount);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const avgOrderValue = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

        // Build stats object
        const stats = {
            totalOrders: allOrders.length,
            todayOrders: todayOrders.length,
            pendingOrders: pendingOrders.length,
            totalRevenue: totalRevenue,
            totalUsers: allProfiles.length,
            completedOrders: completedOrders.length,
            processingOrders: processingOrders.length,
            avgOrderValue: avgOrderValue
        };

        console.log('📊 Calculated stats:', stats);

        // Display stats
        displayStats(stats);

        // Display recent orders (same as orders.js displays them)
        displayRecentOrders(allOrders);

    } catch (error) {
        console.error('❌ Error loading dashboard:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        showDashboardError(error.message);
    }
}

function showDashboardError(errorMessage) {
    console.error('❌ Dashboard error:', errorMessage);

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

    // Show error in console for debugging
    console.log('⚠️  Showing zero stats due to error. Check network tab and backend.');
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
