// Save Order to Profile - Simple localStorage version
// Add this to payment.html before payment.js

// Override confirmPayment function
window.confirmPayment = function () {
    if (!orderData) {
        alert('Order data not found');
        return;
    }

    console.log('💳 Payment confirmed');

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }

    // Get profiles
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.id === currentUser.id);

    if (profileIndex === -1) {
        alert('Profile not found');
        return;
    }

    // Initialize orders if needed
    if (!profiles[profileIndex].orders) {
        profiles[profileIndex].orders = [];
    }

    // Create order
    const order = {
        ...orderData,
        id: 'ORDER_' + Date.now(),
        status: 'pending_verification',
        paymentConfirmedAt: new Date().toISOString()
    };

    // Add to profile
    profiles[profileIndex].orders.push(order);

    // Save
    localStorage.setItem('profiles', JSON.stringify(profiles));

    console.log('✅ Order saved!', order.orderId);

    // Store for confirmation
    sessionStorage.setItem('confirmedOrder', JSON.stringify(order));
    sessionStorage.removeItem('pendingOrder');

    // Redirect
    alert('✅ Order placed successfully!');
    window.location.href = 'confirmation.html';
};

console.log('✅ Payment save override loaded');
