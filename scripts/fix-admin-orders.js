// Read current file
const fs = require('fs');
const filePath = './ADMIN PANEL APP/orders.js';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Replace packageName with package
    let updated = data.replace(
        /\$\{order\.packageName\}/g,
        '${order.package || order.packageName || \'N/A\'}'
    );

    // Write back
    fs.writeFile(filePath, updated, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('✅ Successfully updated orders.js');
        console.log('✅ Changed: order.packageName → order.package || order.packageName || "N/A"');
    });
});
