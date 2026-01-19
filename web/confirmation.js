// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJc3ZLiR9BSB01hOaSRHO3lSmLf0le8zw",
    authDomain: "instagrow-x.firebaseapp.com",
    projectId: "instagrow-x",
    storageBucket: "instagrow-x.firebasestorage.app",
    messagingSenderId: "320041630068",
    appId: "1:320041630068:web:01cde8140ceb3750ee9421",
    measurementId: "G-WMVHQCMEZS"
};

// Try to initialize Firebase, but don't fail if it's not configured
let db = null;
try {
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    }
} catch (error) {
    console.log('Firebase not configured, running in demo mode');
}

// Get order data
const orderData = JSON.parse(sessionStorage.getItem('confirmedOrder'));

if (!orderData) {
    // Try to get from URL parameter as fallback
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId && db) {
        // Fetch order from Firebase
        loadOrderFromFirebase(orderId);
    } else {
        // No order data, redirect to order page
        // window.location.href = 'order.html';
        // For demo, show a sample order
        const sampleOrder = {
            orderId: 'SAMPLE123',
            username: 'user',
            packageName: 'Starter',
            followers: 100,
            amount: 349,
            email: 'email@example.com',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        displayOrderDetails(sampleOrder);
    }
} else {
    displayOrderDetails(orderData);

    // Listen for status updates if Firebase is configured and not demo
    if (db && orderData.id && !orderData.id.startsWith('DEMO_')) {
        listenForStatusUpdates(orderData.id);
    }
}

async function loadOrderFromFirebase(orderId) {
    try {
        const querySnapshot = await db.collection('orders')
            .where('orderId', '==', orderId)
            .get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = { id: doc.id, ...doc.data() };
            displayOrderDetails(data);

            // Listen for status updates
            listenForStatusUpdates(doc.id);
        } else {
            window.location.href = 'order.html';
        }
    } catch (error) {
        console.error('Error loading order:', error);
    }
}

function displayOrderDetails(order) {
    document.getElementById('confirmOrderId').textContent = `#${order.orderId}`;
    document.getElementById('confirmUsername').textContent = `@${order.username}`;
    document.getElementById('confirmPackage').textContent = `${order.packageName} - ${order.followers} Followers`;
    document.getElementById('confirmAmount').textContent = `₹${order.amount}`;
    document.getElementById('confirmEmail').textContent = order.email;

    // Format date
    if (order.createdAt) {
        let date;
        if (typeof order.createdAt === 'string') {
            date = new Date(order.createdAt);
        } else if (order.createdAt.toDate) {
            date = order.createdAt.toDate();
        } else {
            date = new Date();
        }
        document.getElementById('confirmDate').textContent = date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        document.getElementById('confirmDate').textContent = new Date().toLocaleDateString('en-IN');
    }

    // Update status badge
    updateStatusBadge(order.status || 'pending');
}

function updateStatusBadge(status) {
    const statusElement = document.getElementById('orderStatus');
    const statusContainer = statusElement.parentElement;

    // Remove all status classes
    statusContainer.classList.remove('pending', 'processing', 'completed');

    // Add current status class
    statusContainer.classList.add(status);

    // Update text
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.textContent = statusText;

    // Update timeline
    updateTimeline(status);
}

function updateTimeline(status) {
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Reset all items
    timelineItems.forEach(item => {
        item.classList.remove('completed', 'active');
    });

    switch (status) {
        case 'pending':
            timelineItems[0].classList.add('completed');
            timelineItems[1].classList.add('active');
            break;
        case 'processing':
            timelineItems[0].classList.add('completed');
            timelineItems[1].classList.add('completed');
            timelineItems[2].classList.add('active');
            break;
        case 'completed':
            timelineItems.forEach(item => item.classList.add('completed'));
            break;
    }
}

function listenForStatusUpdates(orderId) {
    if (!db) return;

    db.collection('orders').doc(orderId).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            updateStatusBadge(data.status);

            // Show notification when status changes to completed
            if (data.status === 'completed') {
                showCompletionNotification();
            }
        }
    });
}

function showCompletionNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Order Completed! 🎉', {
            body: 'Your Instagram followers have been delivered successfully!',
            icon: '/favicon.ico'
        });
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
