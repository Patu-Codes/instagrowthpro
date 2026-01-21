// Shared Database Module - SINGLE SOURCE OF TRUTH
// This file ensures ALL backend routes use ONE database connection
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// CRITICAL: Use absolute path to prevent issues with different working directories
const DB_PATH = path.join(__dirname, 'instagrowth.db');

console.log('━'.repeat(80));
console.log('📦 DATABASE MODULE INITIALIZED');
console.log('━'.repeat(80));
console.log('🗄️  Database Path:', DB_PATH);
console.log('📍 __dirname:', __dirname);
console.log('━'.repeat(80));

// Create single database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
    console.log('━'.repeat(80));
});

// Initialize tables
db.serialize(() => {
    // Profiles table
    db.run(`CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        createdAt TEXT NOT NULL
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        orderId TEXT PRIMARY KEY,
        profileId TEXT NOT NULL,
        profileUsername TEXT,
        username TEXT NOT NULL,
        profileLink TEXT,
        whatsapp TEXT,
        package TEXT NOT NULL,
        followers INTEGER NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending_verification',
        createdAt TEXT NOT NULL,
        FOREIGN KEY (profileId) REFERENCES profiles (id)
    )`);

    // Chat messages table
    db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        sender TEXT NOT NULL,
        isRead INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
    )`);

    // Demo usage tracking table
    db.run(`CREATE TABLE IF NOT EXISTS demo_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profileId TEXT NOT NULL,
        instagramUsername TEXT NOT NULL,
        usedAt TEXT NOT NULL,
        UNIQUE(profileId),
        UNIQUE(instagramUsername)
    )`);

    // Contact messages table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        status TEXT DEFAULT 'new'
    )`);

    console.log('✅ All database tables initialized');
});

// Export single database instance
module.exports = db;
