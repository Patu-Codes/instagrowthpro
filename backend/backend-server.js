// Smart Backend Server with Chat Support and Email
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

// CRITICAL: Import shared database module (SINGLE SOURCE OF TRUTH)
const db = require('./db');

const app = express();
// Serve Admin Panel (static files)
app.use('/admin', express.static(path.join(__dirname, '../admin')));
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow Vercel domains and localhost
const allowedOrigins = [
    'http://localhost:8000',
    'http://localhost:8001',
    'https://*.vercel.app',
    /\.vercel\.app$/,  // Matches any Vercel subdomain
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list or matches Vercel pattern
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return allowed === origin || origin.includes('vercel.app');
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('⚠️  Blocked origin:', origin);
            callback(null, true); // Still allow for development, change to false in strict production
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

console.log('✅ Server using shared database module from db.js');


// Profile endpoints
app.post('/api/profiles', (req, res) => {
    const { id, username, password, email } = req.body;
    const createdAt = new Date().toISOString();

    // First, check if username already exists
    db.get('SELECT username FROM profiles WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
            // Username already exists
            return res.status(400).json({
                error: 'Username already exists',
                message: 'Try different username, this one exists'
            });
        }

        // Username is available, create the profile
        db.run(
            `INSERT INTO profiles (id, username, password, email, createdAt) VALUES (?, ?, ?, ?, ?)`,
            [id, username, password, email, createdAt],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint')) {
                        return res.status(400).json({
                            error: 'Username already exists',
                            message: 'Try different username, this one exists'
                        });
                    }
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true, profileId: id });
            }
        );
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM profiles WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(401).json({ error: 'Invalid credentials' });

            const token = `TOKEN_${row.id}_${Date.now()}`;
            res.json({ success: true, token, profile: row });
        }
    );
});

app.get('/api/profiles', (req, res) => {
    db.all(`SELECT * FROM profiles ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/profiles/:id', (req, res) => {
    db.get(`SELECT * FROM profiles WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Profile not found' });
        res.json(row);
    });
});

app.get('/api/profiles/:id/orders', (req, res) => {
    db.all(
        `SELECT * FROM orders WHERE profileId = ? ORDER BY createdAt DESC`,
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Order endpoints
app.post('/api/orders', (req, res) => {
    console.log('\n='.repeat(50));
    console.log('📥 NEW ORDER REQUEST RECEIVED');
    console.log('='.repeat(50));
    console.log('📦 req.body:', JSON.stringify(req.body, null, 2));
    console.log('🔗 req.body.profileLink:', req.body.profileLink);
    console.log('🔗 typeof profileLink:', typeof req.body.profileLink);
    console.log('📋 All keys in req.body:', Object.keys(req.body));
    console.log('='.repeat(50));

    const { orderId, profileId, profileUsername, username, profileLink, whatsapp, packageName, followers, amount, createdAt } = req.body;
    const timestamp = createdAt || new Date().toISOString();

    console.log('🔍 Destructured values:');
    console.log('  orderId:', orderId);
    console.log('  profileLink:', profileLink);
    console.log('  packageName:', packageName);

    // Check if this is a Demo order
    if (packageName === 'Demo') {
        // Check if this profile already used demo
        db.get('SELECT * FROM demo_usage WHERE profileId = ?', [profileId], (err, profileRow) => {
            if (err) return res.status(500).json({ error: err.message });

            if (profileRow) {
                return res.status(400).json({
                    error: 'Demo plan already used',
                    message: 'You have already used the Demo plan on your account. Demo is one-time only per user.'
                });
            }

            // Check if this Instagram username already used demo
            db.get('SELECT * FROM demo_usage WHERE instagramUsername = ?', [username], (err, instaRow) => {
                if (err) return res.status(500).json({ error: err.message });

                if (instaRow) {
                    return res.status(400).json({
                        error: 'Demo plan already used on this Instagram',
                        message: `The Demo plan has already been used on @${username}. Each Instagram account can only receive Demo once.`
                    });
                }

                // Demo is available, proceed with order
                createOrder();
            });
        });
    } else {
        // Not a demo order, proceed normally
        createOrder();
    }

    function createOrder() {
        console.log('🔍 Creating order with profileLink:', profileLink);

        db.run(
            `INSERT INTO orders (orderId, profileId, profileUsername, username, profileLink, whatsapp, package, followers, amount, status, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orderId, profileId, profileUsername || '', username, profileLink || '', whatsapp || '', packageName, followers, amount, 'pending_verification', timestamp],
            function (err) {
                if (err) {
                    console.error('❌ Database error:', err.message);
                    return res.status(500).json({ error: err.message });
                }

                console.log('✅ Order saved to database!');
                console.log('   profileLink saved as:', profileLink);

                // If this was a demo order, mark it as used
                if (packageName === 'Demo') {
                    db.run(
                        'INSERT INTO demo_usage (profileId, instagramUsername, usedAt) VALUES (?, ?, ?)',
                        [profileId, username, timestamp],
                        (err) => {
                            if (err) console.error('Error recording demo usage:', err);
                        }
                    );
                }

                res.json({ success: true, orderId });
            }
        );
    }
});

// Instagram Profile Verification (No API needed)
const instagramCheckCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.post('/api/verify-instagram', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            valid: false,
            error: 'Username is required'
        });
    }

    // Clean username
    const cleanUsername = username.trim().replace('@', '');

    // Validate format
    const validFormat = /^[a-zA-Z0-9._]{1,30}$/.test(cleanUsername);
    if (!validFormat) {
        return res.json({
            valid: false,
            exists: false,
            isPublic: false,
            error: 'Invalid username format'
        });
    }

    // Check cache
    const cacheKey = cleanUsername.toLowerCase();
    const cached = instagramCheckCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log(`✅ Cache hit for @${cleanUsername}`);
        return res.json(cached.data);
    }

    try {
        // Check if profile exists with HEAD request first (faster)
        const headResponse = await fetch(`https://www.instagram.com/${cleanUsername}/`, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            redirect: 'follow'
        });

        // Profile doesn't exist
        if (headResponse.status === 404) {
            const result = {
                valid: false,
                exists: false,
                isPublic: false,
                error: 'Profile does not exist'
            };

            instagramCheckCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return res.json(result);
        }

        // Profile exists, now check if it's public by fetching the page
        const pageResponse = await fetch(`https://www.instagram.com/${cleanUsername}/`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const html = await pageResponse.text();

        // Check if account is private
        // Instagram shows "This Account is Private" text on private profiles
        const isPrivate = html.includes('"is_private":true') ||
            html.includes('This Account is Private') ||
            html.includes('is_private\\":true');

        if (isPrivate) {
            const result = {
                valid: false,
                exists: true,
                isPublic: false,
                error: 'Account is private. Please make it public to continue.'
            };

            instagramCheckCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return res.json(result);
        }

        // Profile exists and is public
        const result = {
            valid: true,
            exists: true,
            isPublic: true,
            username: cleanUsername
        };

        instagramCheckCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });

        console.log(`✅ Verified @${cleanUsername} - Public profile`);
        return res.json(result);

    } catch (error) {
        console.error('Instagram verification error:', error.message);

        // Network error - don't cache this
        return res.json({
            valid: false,
            exists: false,
            isPublic: false,
            error: 'Could not verify profile. Please check the username and try again.'
        });
    }
});

// Check if user has used demo
app.get('/api/demo-usage/:profileId', (req, res) => {
    db.get('SELECT * FROM demo_usage WHERE profileId = ?', [req.params.profileId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ used: !!row, usedAt: row?.usedAt });
    });
});

// Check if Instagram ID has used demo
app.get('/api/demo-usage-instagram/:instagramUsername', (req, res) => {
    db.get('SELECT * FROM demo_usage WHERE instagramUsername = ?', [req.params.instagramUsername], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ used: !!row, usedAt: row?.usedAt });
    });
});

app.get('/api/orders', (req, res) => {
    const query = `
        SELECT 
            orders.*,
            profiles.username as profileUsername
        FROM orders
        LEFT JOIN profiles ON orders.profileId = profiles.id
        ORDER BY orders.createdAt DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.patch('/api/orders/:orderId/status', (req, res) => {
    const { status } = req.body;

    db.run(
        `UPDATE orders SET status = ? WHERE orderId = ?`,
        [status, req.params.orderId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, updated: this.changes });
        }
    );
});

// Delete order endpoint
app.delete('/api/orders/:orderId', (req, res) => {
    db.run(
        `DELETE FROM orders WHERE orderId = ?`,
        [req.params.orderId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json({ success: true, message: 'Order deleted successfully' });
        }
    );
});

// Delete user endpoint
app.delete('/api/users/:userId', (req, res) => {
    db.run(
        `DELETE FROM profiles WHERE id = ?`,
        [req.params.userId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ success: true, message: 'User deleted successfully' });
        }
    );
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
    const stats = {};

    db.get(`SELECT COUNT(*) as totalUsers FROM profiles`, [], (err, row) => {
        stats.totalUsers = row?.totalUsers || 0;

        db.get(`SELECT COUNT(*) as totalOrders, SUM(amount) as totalRevenue FROM orders`, [], (err, row) => {
            stats.totalOrders = row?.totalOrders || 0;
            stats.totalRevenue = row?.totalRevenue || 0;

            db.get(`SELECT COUNT(*) as pendingOrders FROM orders WHERE status = 'pending_verification'`, [], (err, row) => {
                stats.pendingOrders = row?.pendingOrders || 0;
                res.json(stats);
            });
        });
    });
});

// ============ CHAT ENDPOINTS ============

// TEST endpoint
app.get('/api/test', (req, res) => {
    console.log('✅ TEST ENDPOINT HIT!');
    res.json({ status: 'working', message: 'Backend is running!' });
});

// Get active chats - MUST BE BEFORE :userId route!
app.get('/api/chat/active-chats', async (req, res) => {
    try {
        console.log('🔍🔍🔍 ACTIVE CHATS ENDPOINT CALLED! 🔍🔍🔍');

        // Get ALL messages
        db.all("SELECT * FROM chat_messages", [], (err, allMsgs) => {
            console.log('📊 Query executed, messages:', allMsgs ? allMsgs.length : 0);

            if (err) {
                console.log('❌ Database error:', err);
                return res.json([]);
            }

            if (!allMsgs || allMsgs.length === 0) {
                console.log('⚠️ NO MESSAGES IN DATABASE');
                return res.json([]);
            }

            // Group by userId manually
            const userMap = {};
            allMsgs.forEach(msg => {
                if (!userMap[msg.userId]) {
                    userMap[msg.userId] = {
                        userId: msg.userId,
                        username: msg.username,
                        messages: []
                    };
                }
                userMap[msg.userId].messages.push(msg);
            });

            // Convert to array
            const result = Object.values(userMap).map(user => ({
                userId: user.userId,
                username: user.username,
                messageCount: user.messages.length,
                unreadCount: user.messages.filter(m => m.sender === 'user' && m.isRead === 0).length,
                lastMessageTime: user.messages[user.messages.length - 1].createdAt
            }));

            console.log('✅ Returning', result.length, 'chats');
            result.forEach(r => console.log(`  - ${r.username}: ${r.messageCount} msgs`));

            res.json(result);
        });
    } catch (error) {
        console.log('💥 CATCH ERROR:', error);
        res.json([]);
    }
});

// Get messages for a user - MUST BE AFTER active-chats!
app.get('/api/chat/:userId', (req, res) => {
    db.all(
        `SELECT * FROM chat_messages WHERE userId = ? ORDER BY createdAt ASC`,
        [req.params.userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Send message
app.post('/api/chat/send', (req, res) => {
    const { userId, username, message, sender } = req.body;
    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO chat_messages (userId, username, message, sender, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, username, message, sender, createdAt],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                success: true,
                messageId: this.lastID,
                message: { id: this.lastID, userId, username, message, sender, createdAt }
            });
        }
    );
});

// Mark messages as read
app.post('/api/chat/mark-read', (req, res) => {
    db.run(
        `UPDATE chat_messages SET isRead = 1 WHERE userId = ? AND sender = 'user'`,
        [req.body.userId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, updated: this.changes });
        }
    );
});

// ==================== CONTACT/EMAIL SUPPORT ====================

// Configure email transporter (Gmail SMTP) - wrapped in try-catch
let transporter = null;
try {
    transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: 'neomatrix.studio@gmail.com',
            pass: 'uojtvvcwedovoelv' // Gmail App Password
        }
    });
    console.log('✅ Email system enabled and ready!');
} catch (error) {
    console.log('⚠️  Email error:', error.message);
}

// Contact form submission endpoint
app.post('/api/contact/send', async (req, res) => {
    const { name, email, subject, message } = req.body;
    const createdAt = new Date().toISOString();

    console.log('📧 Contact form:', { name, email, subject });

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields required' });
    }

    db.run(
        `INSERT INTO contact_messages (name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, ?)`,
        [name, email, subject, message, createdAt],
        function (err) {
            if (err) {
                console.error('❌ DB error:', err);
                return res.status(500).json({ error: 'Failed to save' });
            }

            console.log(`✅ Saved (ID: ${this.lastID})`);

            const mailOptions = {
                from: `"InstaGrowth Pro" <neomatrix.studio@gmail.com>`,
                to: 'neomatrix.studio@gmail.com',
                replyTo: email,
                subject: `[Contact] ${subject}`,
                html: `<div style="font-family:Arial;padding:20px;background:#f5f5f5"><div style="background:white;border-radius:10px;padding:30px;max-width:600px;margin:0 auto"><h2 style="color:#8B5CF6">📧 New Contact Form</h2><p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Date:</strong> ${new Date().toLocaleString()}</p><div style="background:#f9f9f9;padding:20px;margin:20px 0"><p style="white-space:pre-wrap">${message}</p></div></div></div>`
            };

            const autoReply = {
                from: `"InstaGrowth Pro" <neomatrix.studio@gmail.com>`,
                to: email,
                subject: 'We received your message',
                html: `<div style="font-family:Arial;padding:20px;background:#f5f5f5"><div style="background:white;border-radius:10px;padding:30px;max-width:600px;margin:0 auto"><h2 style="color:#8B5CF6">Thank you! 💜</h2><p>Hi ${name},</p><p>We've received your message and will respond within 24 hours.</p><p>WhatsApp: <a href="https://wa.me/919372645587">+91 93726 45587</a></p></div></div>`
            };

            Promise.all([
                transporter.sendMail(mailOptions),
                transporter.sendMail(autoReply)
            ])
                .then(() => {
                    console.log('✅ Emails sent');
                    res.json({ success: true, message: 'Message sent successfully! We will contact you shortly.' });
                })
                .catch((error) => {
                    console.error('❌ Email error:', error);
                    res.json({ success: true, message: 'Message received. We will contact you soon.' });
                });
        }
    );
});

app.get('/api/contact/messages', (req, res) => {
    db.all('SELECT * FROM contact_messages ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log('📊 Endpoints: Chat, Contact/Email');
    console.log('⚠️  Set Gmail App Password in backend-server.js');
});
