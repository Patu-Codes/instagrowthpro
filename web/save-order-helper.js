// Simple order save to profile
// This replaces the Firebase save in payment.js

// Add this at the end of confirmPayment function in payment.js:

function saveOrderToProfile(orderData) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        console.error('No user logged in');
        return false;
    }

    // Get all profiles
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.id === currentUser.id);

    if (profileIndex === -1) {
        console.error('Profile not found');
        return false;
    }

    // Initialize orders array if needed
    if (!profiles[profileIndex].orders) {
        profiles[profileIndex].orders = [];
    }

    // Add order to user's profile
    const confirmedOrder = {
        ...orderData,
        id: 'ORDER_' + Date.now(),
        status: 'pending_verification',
        paymentConfirmedAt: new Date().toISOString()
    };

    profiles[profileIndex].orders.push(confirmedOrder);

    // Save updated profiles
    localStorage.setItem('profiles', JSON.stringify(profiles));

    console.log('✅ Order saved to profile:', confirmedOrder.orderId);

    return confirmedOrder;
}

// Export for use
window.saveOrderToProfile = saveOrderToProfile;
