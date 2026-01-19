// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJc3ZLiR9BSB01hOaSRHO3lSmLf0le8zw",
    authDomain: "instagrow-x.firebaseapp.com",
    projectId: "instagrow-x",
    storageBucket: "instagrow-x.firebasestorage.app",
    messagingSenderId: "320041630068",
    appId: "1:320041630068:web:01cde8140ceb3750ee9421",
    measurementId: "G-WMVHQCMEZS"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

let allOrders = [];
let filteredOrders = [];

// Load orders on page load
window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

// Load all orders from Firebase
function loadOrders() {
    db.collection('orders')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            allOrders = [];
            snapshot.forEach((doc) => {
                allOrders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            updateStatistics();
            filterOrders();
        }, (error) => {
            console.error('Error loading orders:', error);
        });
}

// Update dashboard statistics
function updateStatistics() {
    const pending = allOrders.filter(o => o.status === 'pending').length;
    const processing = allOrders.filter(o => o.status === 'processing').length;
    const completed = allOrders.filter(o => o.status === 'completed').length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('processingCount').textContent = processing;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
}

// Filter orders based on status and search
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    filteredOrders = allOrders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = !searchInput ||
            order.orderId.toLowerCase().includes(searchInput) ||
            order.username.toLowerCase().includes(searchInput) ||
            order.email.toLowerCase().includes(searchInput);

        return matchesStatus && matchesSearch;
    });

    displayOrders();
}

// Display orders in table
function displayOrders() {
    const tbody = document.getElementById('ordersTableBody');
    const displayCount = document.getElementById('displayedCount');

    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="8">
                    <div class="empty-message">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="30" stroke="var(--glass-border)" stroke-width="2"/>
                            <path d="M32 20v16M32 44h.02" stroke="var(--text-secondary)" stroke-width="3"/>
                        </svg>
                        <h3>No orders found</h3>
                        <p>No orders match your filter criteria</p>
                    </div>
                </td>
            </tr>
        `;
        displayCount.textContent = '0 orders';
        return;
    }

    displayCount.textContent = `${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`;

    tbody.innerHTML = filteredOrders.map(order => {
        const date = order.createdAt ?
            (order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt)) :
            new Date();

        return `
            <tr>
                <td><strong>${order.orderId}</strong></td>
                <td>@${order.username}</td>
                <td>${order.packageName} (${order.followers})</td>
                <td><strong>₹${order.amount}</strong></td>
                <td>
                    ${order.email}<br>
                    ${order.whatsapp ? `<small>${order.whatsapp}</small>` : ''}
                </td>
                <td>${date.toLocaleDateString('en-IN')}</td>
                <td>
                    <span class="status-badge ${order.status}">
                        <span class="status-dot"></span>
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewOrder('${order.id}')">
                            View
                        </button>
                        <button class="action-btn update" onclick="updateOrderStatus('${order.id}', '${order.status}')">
                            Update
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// View order details in modal
function viewOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const date = order.createdAt ?
        (order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt)) :
        new Date();

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="order-detail-item">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${order.orderId}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Instagram Username:</span>
            <span class="detail-value">@${order.username}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${order.email}</span>
        </div>
        ${order.whatsapp ? `
        <div class="order-detail-item">
            <span class="detail-label">WhatsApp:</span>
            <span class="detail-value">${order.whatsapp}</span>
        </div>
        ` : ''}
        <div class="order-detail-item">
            <span class="detail-label">Package:</span>
            <span class="detail-value">${order.packageName}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Followers:</span>
            <span class="detail-value">${order.followers}</span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Amount:</span>
            <span class="detail-value"><strong>₹${order.amount}</strong></span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
                <span class="status-badge ${order.status}">
                    <span class="status-dot"></span>
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </span>
        </div>
        <div class="order-detail-item">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">${date.toLocaleString('en-IN')}</span>
        </div>
    `;

    showModal();
}

// Update order status
async function updateOrderStatus(orderId, currentStatus) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h3>Update Order Status</h3>
        <p>Order ID: <strong>${order.orderId}</strong></p>
        <p>Current Status: <span class="status-badge ${currentStatus}">${currentStatus}</span></p>
        
        <div class="status-update-section">
            <h3>Select New Status</h3>
            <div class="status-options">
                <div class="status-option">
                    <input type="radio" name="newStatus" id="statusPending" value="pending" ${currentStatus === 'pending' ? 'checked' : ''}>
                    <label for="statusPending">
                        <span class="status-badge pending">
                            <span class="status-dot"></span>
                            Pending
                        </span>
                        <span>Payment received, awaiting processing</span>
                    </label>
                </div>
                <div class="status-option">
                    <input type="radio" name="newStatus" id="statusProcessing" value="processing" ${currentStatus === 'processing' ? 'checked' : ''}>
                    <label for="statusProcessing">
                        <span class="status-badge processing">
                            <span class="status-dot"></span>
                            Processing
                        </span>
                        <span>Currently delivering followers</span>
                    </label>
                </div>
                <div class="status-option">
                    <input type="radio" name="newStatus" id="statusCompleted" value="completed" ${currentStatus === 'completed' ? 'checked' : ''}>
                    <label for="statusCompleted">
                        <span class="status-badge completed">
                            <span class="status-dot"></span>
                            Completed
                        </span>
                        <span>All followers delivered successfully</span>
                    </label>
                </div>
            </div>
            <button class="btn btn-primary btn-block" onclick="confirmStatusUpdate('${orderId}')">
                Update Status
            </button>
        </div>
    `;

    showModal();
}

// Confirm status update
async function confirmStatusUpdate(orderId) {
    const newStatus = document.querySelector('input[name="newStatus"]:checked');
    if (!newStatus) {
        await window.modal.error('Please select a status', 'Required');
        return;
    }

    try {
        await db.collection('orders').doc(orderId).update({
            status: newStatus.value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        closeModal();

        // Show success message
        await window.modal.success('Order status updated successfully!', 'Success');
    } catch (error) {
        console.error('Error updating order:', error);
        await window.modal.error('Failed to update order status. Please try again.', 'Error');
    }
}

// Modal functions
function showModal() {
    document.getElementById('orderModal').classList.add('active');
}

function closeModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Refresh orders
function refreshOrders() {
    loadOrders();
}

// Close modal when clicking outside
document.getElementById('orderModal').addEventListener('click', (e) => {
    if (e.target.id === 'orderModal') {
        closeModal();
    }
});

// Make functions globally available
window.filterOrders = filterOrders;
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.confirmStatusUpdate = confirmStatusUpdate;
window.closeModal = closeModal;
window.refreshOrders = refreshOrders;
