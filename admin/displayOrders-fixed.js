// Dynamic API Base
const API_BASE = window.location.origin;

// Complete rebuild of displayOrders function with correct fields
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

        // Get package name - check both fields
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
}

console.log('✅ displayOrders function loaded with CORRECT package field');
