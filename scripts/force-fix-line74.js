// Force rewrite orders.js line 74 with correct syntax
const fs = require('fs');
const filePath = './ADMIN PANEL APP/orders.js';

const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Line 74 (index 73)
console.log('Current line 74:', lines[73]);

// Replace with correct template string
lines[73] = '                <td>${order.package || order.packageName || \'N/A\'} (${order.followers})</td>';

console.log('New line 74:', lines[73]);

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('✅ File updated');
