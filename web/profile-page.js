// Profile Page JavaScript
// Helper function to get package name from package code
function getPackageName(packageCode, followers) {
    const packageMap = {
        'demo': 'Demo',
        'starter': 'Starter',
        'growth': 'Growth',
        'pro': 'Pro',
        'elite': 'Elite'
    };

    const name = packageMap[packageCode] || packageCode;
    return followers ? `${name} (${followers} followers)` : name;
}

console.log('📄 profile-page.js loading...');

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    console.log('⚠️ No user logged in');
    window.location.href = 'login.html';
} else {
    console.log('✅ User logged in:', currentUser.username);
    loadProfile();

    // Auto-refresh orders every 10 seconds
    setInterval(() => {
        console.log('🔄 Auto-refreshing orders...');
        loadOrders();
    }, 10000); // 10 seconds
}

function loadProfile() {
    // Display user info
    const firstLetter = currentUser.username.charAt(0).toUpperCase();
    document.getElementById('profileAvatar').textContent = firstLetter;
    document.getElementById('profileUsername').textContent = currentUser.username;

    const createdDate = new Date(currentUser.createdAt).toLocaleDateString();
    document.getElementById('profileCreated').textContent = `Created ${createdDate}`;

    // Settings tab
    document.getElementById('settingsUsername').value = currentUser.username;

    // Load orders
    loadOrders();
}

async function loadOrders() {
    try {
        // Get current user
        const currentUser = window.api.getCurrentUser();

        if (!currentUser) {
            console.log('❌ No user logged in');
            return;
        }

        console.log('📥 Loading orders from API for:', currentUser.username);

        // Fetch orders from API
        const orders = await window.api.getProfileOrders(currentUser.id);

        console.log(`✅ Loaded ${orders.length} orders from API`);

        if (!orders || orders.length === 0) {
            document.getElementById('noOrders').style.display = 'block';
            document.getElementById('ordersTable').style.display = 'none';
            document.getElementById('totalOrders').textContent = '0';
            document.getElementById('totalSpent').textContent = '₹0';
            document.getElementById('totalFollowers').textContent = '0';
            return;
        }

        // Calculate stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const totalFollowers = orders.reduce((sum, order) => sum + (order.followers || 0), 0);

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalSpent').textContent = `₹${totalSpent}`;
        document.getElementById('totalFollowers').textContent = totalFollowers.toLocaleString();

        // Display orders table
        document.getElementById('noOrders').style.display = 'none';
        document.getElementById('ordersTable').style.display = 'block';

        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = '';

        // Sort by date (newest first)
        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedOrders.forEach(order => {
            const row = createOrderRow(order);
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('❌ Error loading orders:', error);
        document.getElementById('noOrders').style.display = 'block';
        document.getElementById('ordersTable').style.display = 'none';
    }
}

function createOrderRow(order) {
    const tr = document.createElement('tr');

    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    const date = new Date(order.createdAt).toLocaleDateString();

    tr.innerHTML = `
        <td><strong>#${order.orderId}</strong></td>
        <td>${order.packageName || getPackageName(order.package, order.followers) || 'N/A'}</td>
        <td>@${order.username}</td>
        <td>₹${order.amount}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${date}</td>
        <td>
            <button class="btn btn-secondary btn-small" onclick='viewOrderDetails(${JSON.stringify(order).replace(/'/g, "&apos;")})'>
                View
            </button>
        </td>
    `;

    return tr;
}

function getStatusClass(status) {
    const classes = {
        'pending_verification': 'status-pending',
        'processing': 'status-processing',
        'completed': 'status-completed',
        'pending': 'status-pending'
    };
    return classes[status] || 'status-pending';
}

function getStatusText(status) {
    const texts = {
        'pending_verification': 'Verifying Payment',
        'processing': 'Processing',
        'completed': 'Completed',
        'pending': 'Pending'
    };
    return texts[status] || status;
}

// viewOrderDetails is now in order-invoice-modal.js - professional modal with real-time updates


// Tab switching
function switchTab(tab) {
    const ordersTab = document.getElementById('ordersTab');
    const settingsTab = document.getElementById('settingsTab');
    const ordersContent = document.getElementById('ordersContent');
    const settingsContent = document.getElementById('settingsContent');

    if (tab === 'orders') {
        ordersTab.classList.add('active');
        settingsTab.classList.remove('active');
        ordersContent.style.display = 'block';
        settingsContent.style.display = 'none';
    } else {
        settingsTab.classList.add('active');
        ordersTab.classList.remove('active');
        settingsContent.style.display = 'block';
        ordersContent.style.display = 'none';
    }
}

// Update password
function updatePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newPassword) {
        window.modal.error('Please enter a new password', 'Required');
        return;
    }

    if (newPassword.length < 4) {
        window.modal.error('Password must be at least 4 characters', 'Invalid Password');
        return;
    }

    if (newPassword !== confirmPassword) {
        window.modal.error('Passwords do not match', 'Mismatch');
        return;
    }

    // Update password in profiles
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.id === currentUser.id);

    if (profileIndex !== -1) {
        profiles[profileIndex].password = newPassword;
        localStorage.setItem('profiles', JSON.stringify(profiles));

        // Update current user
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        window.modal.success('Your password has been updated successfully', 'Password Updated');
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }
}

// Delete account
function deleteAccount() {
    if (!confirm('⚠️ Are you sure you want to delete your account? This cannot be undone!')) {
        return;
    }

    if (!confirm('❗ This will permanently delete all your orders and data. Continue?')) {
        return;
    }

    // Remove from profiles
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const updatedProfiles = profiles.filter(p => p.id !== currentUser.id);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

    // Logout
    localStorage.removeItem('currentUser');

    window.modal.success('Your account has been deleted', 'Account Deleted');
    window.location.href = 'index.html';
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Make functions global
window.switchTab = switchTab;
window.updatePassword = updatePassword;
window.deleteAccount = deleteAccount;
window.logout = logout;
// viewOrderDetails and closeInvoiceModal are in order-invoice-modal.js

console.log('✅ Profile page loaded');
