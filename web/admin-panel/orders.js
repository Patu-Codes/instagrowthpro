// Orders Management JavaScript
console.log('📦 Orders Management Loading...');

// Check authentication
if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = 'index.html';
}

let allOrders = [];
let currentFilter = 'all';

// Load all orders
function loadOrders() {
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    // Collect all orders
    allOrders = [];
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

    console.log(`📦 Loaded ${allOrders.length} orders`);
    displayOrders(allOrders);
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    document.getElementById('orderCount').textContent = orders.length;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <div style="color: var(--text-secondary);">No orders found</div>
                </td>
            </tr>
        `;
        return;
    }

    // Sort by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = sortedOrders.map(order => {
        const date = new Date(order.createdAt).toLocaleString();
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);

        return `
            <tr>
                <td><strong>#${order.orderId || 'N/A'}</strong></td>
                <td><strong>@${order.profileUsername}</strong></td>
                <td>@${order.username}</td>
                <td>${order.packageName} (${order.followers})</td>
                <td><strong>₹${order.amount}</strong></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${date}</td>
                <td>
                    <button class="btn-action" onclick='viewOrder(${JSON.stringify(order).replace(/'/g, "&#39;")})'>View</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewOrder(order) {
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    const date = new Date(order.createdAt).toLocaleString();

    document.getElementById('orderModalBody').innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <!-- Order Info -->
            <div>
                <h3 style="margin-bottom: 1rem; font-size: 1.125rem;">Order Information</h3>
                <div style="display: grid; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Order ID:</span>
                        <strong>#${order.orderId}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Profile User:</span>
                        <strong>@${order.profileUsername}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Instagram:</span>
                        <strong>@${order.username}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Email:</span>
                        <strong>${order.email}</strong>
                    </div>
                    ${order.whatsapp ? `
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">WhatsApp:</span>
                        <strong>${order.whatsapp}</strong>
                    </div>` : ''}
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Date:</span>
                        <strong>${date}</strong>
                    </div>
                </div>
            </div>

            <!-- Package Details -->
            <div>
                <h3 style="margin-bottom: 1rem; font-size: 1.125rem;">Package Details</h3>
                <div style="display: grid; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Package:</span>
                        <strong>${order.packageName}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Followers:</span>
                        <strong>${order.followers}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Amount:</span>
                        <strong style="color: #10B981; font-size: 1.25rem;">₹${order.amount}</strong>
                    </div>
                </div>
            </div>

            <!-- Status Update -->
            <div>
                <h3 style="margin-bottom: 1rem; font-size: 1.125rem;">Update Status</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 1rem;">
                    <span style="color: var(--text-secondary);">Current Status:</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <select id="statusSelect" class="search-box" style="width: 100%; margin-bottom: 1rem;">
                    <option value="pending_verification" ${order.status === 'pending_verification' ? 'selected' : ''}>Pending Verification</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="btn-primary" style="width: 100%;" onclick="updateOrderStatus('${order.orderId}', '${order.profileId}')">
                    Update Status
                </button>
            </div>
        </div>
    `;

    document.getElementById('orderModal').classList.add('active');
}

function updateOrderStatus(orderId, profileId) {
    const newStatus = document.getElementById('statusSelect').value;

    // Get profiles
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.id === profileId);

    if (profileIndex === -1) {
        alert('Profile not found');
        return;
    }

    // Find and update order
    const orderIndex = profiles[profileIndex].orders.findIndex(o => o.orderId === orderId);

    if (orderIndex === -1) {
        alert('Order not found');
        return;
    }

    profiles[profileIndex].orders[orderIndex].status = newStatus;
    profiles[profileIndex].orders[orderIndex].updatedAt = new Date().toISOString();

    // Save back to localStorage
    localStorage.setItem('profiles', JSON.stringify(profiles));

    alert(`✅ Order status updated to: ${getStatusText(newStatus)}`);

    closeModal();
    loadOrders();
}

function setFilter(filter) {
    currentFilter = filter;

    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    filterOrders();
}

function filterOrders() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();

    let filtered = allOrders;

    // Apply status filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(o => o.status === currentFilter);
    }

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(o =>
            (o.orderId && o.orderId.toLowerCase().includes(searchTerm)) ||
            (o.profileUsername && o.profileUsername.toLowerCase().includes(searchTerm)) ||
            (o.username && o.username.toLowerCase().includes(searchTerm))
        );
    }

    displayOrders(filtered);
}

function closeModal() {
    document.getElementById('orderModal').classList.remove('active');
}

function getStatusClass(status) {
    return {
        'pending_verification': 'status-pending',
        'processing': 'status-processing',
        'completed': 'status-completed'
    }[status] || 'status-pending';
}

function getStatusText(status) {
    return {
        'pending_verification': 'Pending',
        'processing': 'Processing',
        'completed': 'Completed'
    }[status] || status;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    }
}

// Initialize
loadOrders();

// Make functions global
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.closeModal = closeModal;
window.setFilter = setFilter;
window.filterOrders = filterOrders;
window.logout = logout;

console.log('✅ Orders management loaded');
