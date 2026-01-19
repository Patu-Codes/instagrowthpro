// Admin Dashboard JavaScript
console.log('📊 Admin Dashboard Loading...');

// Check authentication
if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = 'index.html';
}

// Load dashboard data
function loadDashboard() {
    // Get all profiles from parent directory's localStorage
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    // Collect all orders from all profiles
    let allOrders = [];
    profiles.forEach(profile => {
        if (profile.orders && Array.isArray(profile.orders)) {
            profile.orders.forEach(order => {
                allOrders.push({
                    ...order,
                    profileUsername: profile.username,
                    profileId: profile.id
                });
            });
        }
    });

    console.log(`📦 Found ${allOrders.length} total orders from ${profiles.length} users`);

    // Calculate stats
    calculateStats(allOrders, profiles);

    // Display recent orders
    displayRecentOrders(allOrders);
}

function calculateStats(orders, profiles) {
    const today = new Date().toDateString();

    // Total orders
    document.getElementById('totalOrders').textContent = orders.length;

    // Today's orders
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    document.getElementById('todayOrders').textContent = todayOrders.length;

    // Pending orders
    const pendingOrders = orders.filter(o => o.status === 'pending_verification');
    document.getElementById('pendingOrders').textContent = pendingOrders.length;

    // Total revenue
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;

    // Additional stats
    document.getElementById('totalUsers').textContent = profiles.length;

    const completedOrders = orders.filter(o => o.status === 'completed');
    document.getElementById('completedOrders').textContent = completedOrders.length;

    const processingOrders = orders.filter(o => o.status === 'processing');
    document.getElementById('processingOrders').textContent = processingOrders.length;

    const avgValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    document.getElementById('avgOrderValue').textContent = `₹${avgValue}`;
}

function displayRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
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
                <td>@${order.profileUsername}</td>
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
