// Node script to FIX the displayOrders function in orders.js
const fs = require('fs');
const filePath = './ADMIN PANEL APP/orders.js';

console.log('Reading orders.js...');
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the displayOrders function
const functionStart = content.indexOf('function displayOrders(orders) {');
const functionEnd = content.indexOf('}\n', content.indexOf('}).join(\'\');', functionStart)) + 2;

if (functionStart === -1 || functionEnd === -1) {
    console.error('❌ Could not find displayOrders function');
    process.exit(1);
}

console.log('Found function from char', functionStart, 'to', functionEnd);

const newFunction = `function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    document.getElementById('orderCount').textContent = orders.length;

    if (orders.length === 0) {
        tbody.innerHTML = \`
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <div style="color: var(--text-secondary);">No orders found</div>
                </td>
            </tr>
        \`;
        return;
    }

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = sortedOrders.map(order => {
        const date = new Date(order.createdAt).toLocaleString();
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        const packageName = order.package || order.packageName || 'N/A';

        return \`
            <tr>
                <td><strong>#\${order.orderId || 'N/A'}</strong></td>
                <td><strong>@\${order.profileUsername || 'Unknown User'}</strong></td>
                <td>\${order.profileLink ? \`<a href="\${order.profileLink}" target="_blank" style="color: #8B5CF6; text-decoration: none; font-weight: 600;">🔗 Link</a>\` : '<span style="color: var(--text-secondary);">N/A</span>'}</td>
                <td><strong style="color: #EC4899;">@\${order.username || 'NOT PROVIDED'}</strong></td>
                <td>\${packageName} (\${order.followers})</td>
                <td><strong>₹\${order.amount}</strong></td>
                <td><span class="status-badge \${statusClass}">\${statusText}</span></td>
                <td>\${date}</td>
                <td>
                    <button class="btn-action" onclick='viewOrder(\${JSON.stringify(order).replace(/'/g, "&#39;")})'>View</button>
                    <button class="btn-delete" onclick="deleteOrder('\${order.orderId}')" style="background: linear-gradient(135deg, #EF4444, #DC2626); margin-left: 0.5rem;">Delete</button>
                </td>
            </tr>
        \`;
    }).join('');
}`;

// Replace the function
const newContent = content.substring(0, functionStart) + newFunction + content.substring(functionEnd);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ displayOrders function replaced successfully!');
console.log('✅ Now using: order.package || order.packageName');
console.log('✅ Profile Link column included');
