// Orders Management JavaScript
console.log('📦 Orders Management Loading...');

// Check authentication
if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = 'index.html';
}

let allOrders = [];
let currentFilter = 'all';

// Load all orders from API
async function loadOrders() {
    console.log('📥 Loading orders from API...');

    try {
        const response = await fetch(`${API_BASE || window.location.origin}/api/orders');
        if (!response.ok) throw new Error('Failed to load orders');

        allOrders = await response.json();

        console.log(`📦 Loaded ${allOrders.length} orders from API`);
        displayOrders(allOrders);
    } catch (error) {
        console.error('❌ Error loading orders:', error);
        document.getElementById('ordersTableBody').innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: #EF4444;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                    <div>Failed to load orders</div>
                    <div style="font-size: 0.875rem; margin-top: 0.5rem; opacity: 0.7;">Make sure backend server is running on port 3000</div>
                </td>
            </tr>
        `;
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    document.getElementById('orderCount').textContent = orders.length;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <div style="color: var(--text-secondary);">No orders found</div>
                </td>
            </tr>
        `;
        return;
    }

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = sortedOrders.map(order => {
        const date = new Date(order.createdAt).toLocaleString();
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        const packageName = order.package || order.packageName || 'N/A';

        return `
            <tr>
                <td><strong>#${order.orderId || 'N/A'}</strong></td>
                <td><strong>@${order.profileUsername || 'Unknown User'}</strong></td>
                <td>${order.profileLink ? `<a href="${order.profileLink}" target="_blank" style="color: #8B5CF6; text-decoration: none; font-weight: 600;">🔗 Link</a>` : '<span style="color: var(--text-secondary);">N/A</span>'}</td>
                <td><strong style="color: #EC4899;">@${order.username || 'NOT PROVIDED'}</strong></td>
                <td>${packageName} (${order.followers})</td>
                <td><strong>₹${order.amount}</strong></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${date}</td>
                <td>
                    <button class="btn-action" onclick='viewOrder(${JSON.stringify(order).replace(/'/g, "&#39;")})'>View</button>
                    <button class="btn-delete" onclick="deleteOrder('${order.orderId}')" style="background: linear-gradient(135deg, #EF4444, #DC2626); margin-left: 0.5rem;">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}/ Orders Management JavaScript
console.log('📦 Orders Management Loading...');

// Check authentication
if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = 'index.html';
}

let allOrders = [];
let currentFilter = 'all';

// Load all orders from API
async function loadOrders() {
    console.log('📥 Loading orders from API...');

    try {
        const response = await fetch(`${API_BASE || window.location.origin}/api/orders');
        if (!response.ok) throw new Error('Failed to load orders');

        allOrders = await response.json();

        console.log(`📦 Loaded ${allOrders.length} orders from API`);
        displayOrders(allOrders);
    } catch (error) {
        console.error('❌ Error loading orders:', error);
        document.getElementById('ordersTableBody').innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: #EF4444;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                    <div>Failed to load orders</div>
                    <div style="font-size: 0.875rem; margin-top: 0.5rem; opacity: 0.7;">Make sure backend server is running on port 3000</div>
                </td>
            </tr>
        `;
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    document.getElementById('orderCount').textContent = orders.length;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem;">
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
                <td><strong>@${order.profileUsername || 'Unknown User'}</strong></td>
                <td>${order.profileLink ? `<a href="${order.profileLink}" target="_blank" style="color: #8B5CF6; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Link
                </a>` : '<span style="color: var(--text-secondary);">N/A</span>'}</td>
                <td><strong style="color: #EC4899;">@${order.username || 'NOT PROVIDED'}</strong></td>
                <td>${order.package || order.packageName || 'N/A'} (${order.followers})</td>
                <td><strong>₹${order.amount}</strong></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${date}</td>
                <td>
                    <button class="btn-action" onclick='viewOrder(${JSON.stringify(order).replace(/'/g, "&#39;")})'>View</button>
                    <button class="btn-delete" onclick="deleteOrder('${order.orderId}')" style="background: linear-gradient(135deg, #EF4444, #DC2626); margin-left: 0.5rem;">Delete</button>
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
                        <strong>\$\{order.package \|\| order.packageName \|\| 'N/A'\}</strong>
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

async function updateOrderStatus(orderId, profileId) {
    const newStatus = document.getElementById('statusSelect').value;

    try {
        console.log(`🔄 Updating order ${orderId} to ${newStatus}...`);

        const response = await fetch(`${API_BASE || window.location.origin}/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Update failed');

        alert(`✅ Order status updated to: ${getStatusText(newStatus)}`);
        closeModal();
        await loadOrders();

    } catch (error) {
        console.error('❌ Error updating status:', error);
        window.modal.error('Error: ' + error.message, 'Error');
    }
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

// Delete order function
async function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete order #${orderId}?\n\nThis action cannot be undone!`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE || window.location.origin}/api/orders/${orderId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.modal.success('Order deleted successfully', 'Deleted');
            // Reload orders to refresh the list
            loadOrders();
        } else {
            window.modal.error('Failed to delete order: ' + (data.error || 'Unknown error'), 'Error');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        window.modal.error('Failed to delete order. Please try again.', 'Error');
    }
}

window.deleteOrder = deleteOrder;

console.log('✅ Orders management loaded');


// Initialize - Load orders on page load
loadOrders();
