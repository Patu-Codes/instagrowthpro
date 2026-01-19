// Payment Completion Handler - Uses API
// Professional modals instead of alerts

console.log('💳 Payment completion system loading...');

// Handle payment completion
window.handlePaymentComplete = async function () {
    console.log('💰 Processing payment completion...');

    try {
        // Get current user from API
        const currentUser = window.api.getCurrentUser();

        if (!currentUser) {
            await window.modal.error(
                'Please login to complete your order.',
                'Not Logged In'
            );
            window.location.href = 'login.html';
            return;
        }

        // Get order details from storage
        const orderData = JSON.parse(sessionStorage.getItem('pendingOrder') || '{}');

        if (!orderData.username) {
            await window.modal.error(
                'No order found. Please start a new order.',
                'Order Not Found'
            );
            window.location.href = 'order.html';
            return;
        }

        // Create order via API
        const order = {
            orderId: 'ORD_' + Date.now(),
            profileId: currentUser.id,
            username: orderData.username,
            email: orderData.email,
            whatsapp: orderData.whatsapp || '',
            packageName: orderData.packageName,
            followers: orderData.followers,
            amount: orderData.amount,
            status: 'pending_verification'
        };

        console.log('📤 Saving order to API...', order.orderId);

        // Save order
        await window.api.createOrder(order);

        console.log('✅ Order saved successfully!');

        // Clear pending order
        sessionStorage.removeItem('pendingOrder');

        // Show success modal
        await window.modal.success(
            `Your order #${order.orderId} has been placed successfully! We'll verify your payment and start processing your order soon.`,
            'Order Placed! 🎉'
        );

        // Redirect to profile page
        window.location.href = 'profile.html';

    } catch (error) {
        console.error('❌ Error completing payment:', error);

        await window.modal.error(
            'Failed to save your order. Please contact support with your payment screenshot.',
            'Error Saving Order'
        );
    }
};

console.log('✅ Payment completion system ready');
