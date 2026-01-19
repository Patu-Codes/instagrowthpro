const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./instagrowth.db');

console.log('🔧 Adding email column to profiles table...');

db.run(`ALTER TABLE profiles ADD COLUMN email TEXT`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column')) {
            console.log('✅ Email column already exists');
        } else {
            console.error('❌ Error:', err.message);
        }
    } else {
        console.log('✅ Email column added successfully!');
    }
    db.close(() => {
        console.log('✅ Database updated and closed');
        process.exit(0);
    });
});
