// Orders Management JavaScript
console.log('📦 Orders Management Loading...');

// CRITICAL: API Base for all requests
const API_BASE = window.location.origin;
console.log('🌐 Orders.js API Base:', API_BASE);

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
        const response = await fetch(`${API_BASE}/api/orders`);
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
                    <div style="font-size: 0.875rem; margin-top: 0.5rem; opacity: 0.7;">Check console and backend connection</div>
                </td>
            </tr>
        `;
    }
}
