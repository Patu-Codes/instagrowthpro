// Add loadOrders initialization
const fs = require('fs');
const file = './ADMIN PANEL APP/orders.js';

let content = fs.readFileSync(file, 'utf8');

// Remove trailing whitespace
content = content.trimEnd();

// Add initialization if not present
if (!content.includes('loadOrders();')) {
    content += '\n\n// Initialize - Load orders on page load\nloadOrders();\n';
    fs.writeFileSync(file, content, 'utf8');
    console.log('✅ Added loadOrders() initialization!');
} else {
    console.log('ℹ️  loadOrders() already exists');
}
