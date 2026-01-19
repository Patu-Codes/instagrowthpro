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

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Check authentication and load orders
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log('✅ User logged in:', user.email);

        // Update navigation
        updateNavigation(user);

        // Load user's orders
        await loadMyOrders(user.uid);
    } else {
        console.log('❌ No user logged in, redirecting...');
        window.location.href = 'login.html';
    }
});

function updateNavigation(user) {
    const userNav = document.getElementById('userNav');
    userNav.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="color: var(--text-secondary);">Welcome, <strong>${user.email}</strong></span>
            <button class="btn btn-secondary" onclick="logout()">Logout</button>
        </div>
    `;
}

async function loadMyOrders(userId) {
    const loadingState = document.getElementById('loadingState');
    const noOrdersState = document.getElementById('noOrdersState');
    const ordersContainer = document.getElementById('ordersContainer');
    const tableBody = document.getElementById('ordersTableBody');

    // Show loading
    loadingState.style.display = 'block';
    noOrdersState.style.display = 'none';
    ordersContainer.style.display = 'none';

    try {
        // Query orders for this user
        const ordersSnapshot = await db.collection('orders')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        loadingState.style.display = 'none';

        if (ordersSnapshot.empty) {
            noOrdersState.style.display = 'block';
            return;
        }

        // Display orders
        ordersContainer.style.display = 'block';
        tableBody.innerHTML = '';

        ordersSnapshot.forEach((doc) => {
            const order = doc.data();
            const row = createOrderRow(order, doc.id);
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('❌ Error loading orders:', error);
        loadingState.style.display = 'none';
        await window.modal.error('Error loading orders: ' + error.message, 'Error');
    }
}

function createOrderRow(order, docId) {
    const tr = document.createElement('tr');

    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    const date = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A';

    tr.innerHTML = `
        <td><strong>#${order.orderId || docId.substring(0, 8)}</strong></td>
        <td>${order.packageName || getPackageName(order.package, order.followers) || 'N/A'}</td>
        <td>@${order.username}</td>
        <td>₹${order.amount}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${date}</td>
        <td>
            <button class="btn btn-secondary btn-small" onclick='viewOrderDetails(${JSON.stringify(order).replace(/'/g, "&aposobras;")}, "${docId}")'>
                View Details
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

function viewOrderDetails(order, docId) {
    const modal = document.getElementById('orderDetailsModal');
    const body = document.getElementById('orderDetailsBody');

    const date = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : 'N/A';
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);

    body.innerHTML = `
        <div class="order-detail-grid" style="display: grid; gap: 1.5rem;">
            <div class="detail-section">
                <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Order Information</h3>
                <div style="display: grid; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Order ID:</span>
                        <strong>#${order.orderId || docId}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Status:</span>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Date:</span>
                        <strong>${date}</strong>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Package Details</h3>
                <div style="display: grid; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <div class="invoice-row">
                            <span class="invoice-label">Package</span>
                            <span class="invoice-value">${order.packageName || getPackageName(order.package, order.followers) || 'N/A'}</span>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <div class="invoice-row">
                            <span class="invoice-label">Email</span>
                            <span class="invoice-value">${order.email || 'Not provided'}</span>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Followers:</span>
                        <strong>${order.followers}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Instagram:</span>
                        <strong>@${order.username}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                        <span style="color: var(--text-secondary);">Amount:</span>
                        <strong style="color: #10B981; font-size: 1.25rem;">₹${order.amount}</strong>
                    </div>
                </div>
            </div>
            
            ${order.status === 'pending_verification' ? `
                <div style="background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.3); padding: 1rem; border-radius: 8px;">
                    <p style="color: #EC4899; margin: 0;">⏳ Your payment is being verified. This usually takes 1-5 minutes.</p>
                </div>
            ` : ''}
            
            ${order.status === 'processing' ? `
                <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 8px;">
                    <p style="color: #3B82F6; margin: 0;">🚀 Your order is being processed. Followers will be delivered within 5 minutes!</p>
                </div>
            ` : ''}
            
            ${order.status === 'completed' ? `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1rem; border-radius: 8px;">
                    <p style="color: #10B981; margin: 0;">✅ Order completed! Followers have been delivered to @${order.username}</p>
                </div>
            ` : ''}
        </div>
    `;

    modal.style.display = 'flex';
}

function closeOrderDetails() {
    document.getElementById('orderDetailsModal').style.display = 'none';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.signOut().then(() => {
            window.location.href = 'login.html';
        });
    }
}

// Make functions globally available
window.viewOrderDetails = viewOrderDetails;
window.closeOrderDetails = closeOrderDetails;
window.logout = logout;

console.log('✅ my-orders.js loaded');
