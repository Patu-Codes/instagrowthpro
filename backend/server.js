const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Firebase Admin
// IMPORTANT: Replace this with your Firebase service account key
// Download from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Routes

// Get all orders (for admin)
app.get('/api/orders', async (req, res) => {
    try {
        const { status, limit = 100 } = req.query;
        let query = db.collection('orders').orderBy('createdAt', 'desc');

        if (status && status !== 'all') {
            query = query.where('status', '==', status);
        }

        query = query.limit(parseInt(limit));

        const snapshot = await query.get();
        const orders = [];

        snapshot.forEach(doc => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single order
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const snapshot = await db.collection('orders')
            .where('orderId', '==', orderId)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        const doc = snapshot.docs[0];
        res.json({
            success: true,
            order: {
                id: doc.id,
                ...doc.data()
            }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { username, email, whatsapp, package: pkg, packageName, followers, amount, amountUSD } = req.body;

        // Validate required fields
        if (!username || !email || !pkg || !amount) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Generate order ID
        const orderId = generateOrderId();

        const order = {
            orderId,
            username: username.replace('@', ''),
            email,
            whatsapp: whatsapp || '',
            package: pkg,
            packageName,
            followers,
            amount,
            amountUSD,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('orders').add(order);

        res.json({
            success: true,
            orderId: docRef.id,
            order: { id: docRef.id, ...order }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'processing', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        await db.collection('orders').doc(id).update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send notification if completed
        if (status === 'completed') {
            const doc = await db.collection('orders').doc(id).get();
            const orderData = doc.data();

            // Here you can add email/WhatsApp notification logic
            console.log(`Order ${orderData.orderId} completed for @${orderData.username}`);
        }

        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const ordersSnapshot = await db.collection('orders').get();

        let totalOrders = 0;
        let totalRevenue = 0;
        let pending = 0;
        let processing = 0;
        let completed = 0;

        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            totalOrders++;
            totalRevenue += order.amount || 0;

            switch (order.status) {
                case 'pending':
                    pending++;
                    break;
                case 'processing':
                    processing++;
                    break;
                case 'completed':
                    completed++;
                    break;
            }
        });

        res.json({
            success: true,
            stats: {
                totalOrders,
                totalRevenue,
                pending,
                processing,
                completed
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'confirmation.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Helper function to generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `IG${timestamp}${random}`.toUpperCase();
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/admin.html`);
});
