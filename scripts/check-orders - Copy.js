const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./instagrowth.db');

console.log('🔍 Checking orders table structure...\n');

// Check what fields exist in orders
db.all('PRAGMA table_info(orders)', [], (err, columns) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Orders table columns:');
        columns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });
    }

    // Get a sample order to see what data we have
    db.get('SELECT * FROM orders LIMIT 1', [], (err, order) => {
        if (err) {
            console.error('Error getting order:', err);
        } else if (order) {
            console.log('\nSample order data:');
            console.log(JSON.stringify(order, null, 2));
        } else {
            console.log('\nNo orders found');
        }

        db.close();
    });
});
