// Get pending order from session storage
console.log('🔍 Checking for pending order...');
const orderData = JSON.parse(sessionStorage.getItem('pendingOrder'));

console.log('📦 Pending order data:', orderData);

// Wait for DOM to be ready before updating elements
document.addEventListener('DOMContentLoaded', function () {
    if (!orderData) {
        // Redirect back to order page if no order data
        console.error('❌ No pending order found in sessionStorage');
        console.log('Available sessionStorage keys:', Object.keys(sessionStorage));

        window.modal.error('No order data found. Redirecting to order page...', 'Order Not Found').then(() => {
            window.location.href = 'order.html';
        });
    } else {
        console.log('✅ Loaded pending order:', orderData);

        // Display order information
        if (document.getElementById('orderId')) {
            document.getElementById('orderId').textContent = `Order #${orderData.orderId}`;
        }
        if (document.getElementById('displayUsername')) {
            document.getElementById('displayUsername').textContent = `@${orderData.username}`;
        }
        if (document.getElementById('displayPackage')) {
            document.getElementById('displayPackage').textContent = `${orderData.packageName} (${orderData.followers} followers)`;
        }
        if (document.getElementById('displayAmount')) {
            document.getElementById('displayAmount').textContent = `₹${orderData.amount}`;
        }
        if (document.getElementById('verifyAmount')) {
            document.getElementById('verifyAmount').textContent = orderData.amount;
        }

        // Update UPI button amount
        const upiButtonAmount = document.getElementById('upiButtonAmount');
        if (upiButtonAmount) {
            upiButtonAmount.textContent = orderData.amount;
        }

        // Update UPI input amount
        const upiInputAmount = document.getElementById('upiInputAmount');
        if (upiInputAmount) {
            upiInputAmount.textContent = orderData.amount;
        }

        console.log('✅ All order details displayed successfully');
    }
});

// Initialize Firebase
let db = null;
try {
    if (typeof firebase !== 'undefined' && orderData && orderData.firebaseConfig) {
        if (!firebase.apps.length) {
            firebase.initializeApp(orderData.firebaseConfig);
        }
        db = firebase.firestore();
        console.log('✅ Firebase initialized on payment page');
    }
} catch (error) {
    console.log('⚠️ Firebase not configured:', error);
}

// UPI Payment Configuration
const UPI_ID = "9372645587@mbk";  // Your merchant UPI ID
const MERCHANT_NAME = "InstaGrowth Pro";

// Function to validate user's UPI ID and open their UPI app with payment to merchant
function payToUpiId() {
    if (!orderData) {
        window.modal.error('Order data not found. Please start a new order.', 'Error');
        return;
    }

    const userUpiId = document.getElementById('recipientUpiId').value.trim();

    if (!userUpiId) {
        window.modal.error('Please enter your UPI ID', 'Required');
        return;
    }

    // Basic UPI ID validation
    if (!userUpiId.includes('@')) {
        window.modal.error('Please enter a valid UPI ID (e.g., yourname@paytm)', 'Invalid UPI ID');
        return;
    }

    const amount = orderData.amount;
    const transactionNote = `InstaGrowth Pro - ${orderData.packageName} - ${orderData.followers} followers - Order ${orderData.orderId}`;

    // Create UPI payment link
    // User's UPI app will open with YOUR UPI ID (9372645587@mbk) as the RECIPIENT
    const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    console.log('🚀 Opening user\'s UPI app...');
    console.log('💰 Payment to:', UPI_ID);
    console.log('💵 Amount:', amount);

    // Open user's UPI app
    window.location.href = upiLink;

    // Show confirmation
    setTimeout(() => {
        window.modal.info(
            `Opening your UPI app (${userUpiId})...\n\nYou will pay ₹${amount} to ${UPI_ID}\n\nAfter completing payment, click "I've Completed Payment" button`,
            'Redirecting to UPI App'
        );
    }, 500);
}

// Make functions globally available
window.payToUpiId = payToUpiId;

// 🚀 **Real UPI Payment Link** - Opens actual UPI apps with merchant UPI
function openUPIApp() {
    if (!orderData) {
        window.modal.error('Order data not found. Please start a new order.', 'Error');
        return;
    }

    const amount = orderData.amount;
    const transactionNote = `InstaGrowth Pro - ${orderData.packageName} - ${orderData.followers} followers - Order ${orderData.orderId}`;

    // Create UPI deep link with YOUR merchant UPI ID (9372645587@mbk)
    const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    console.log('🚀 Opening UPI app with link:', upiLink);
    console.log('💰 Payment to:', UPI_ID);

    // Try to open UPI app
    window.location.href = upiLink;

    // Show instructions after attempt
    setTimeout(() => {
        window.modal.info(
            `UPI app should open automatically.\n\nPayment Details:\n• Amount: ₹${amount}\n• Pay to: ${UPI_ID}\n• Service: ${orderData.packageName}\n\nIf app doesn't open, scan QR code or manually pay to ${UPI_ID}\n\nAfter payment, click "I've Completed Payment"`,
            'Opening UPI App'
        );
    }, 500);
}

// Confirm payment and save to database
async function confirmPayment() {
    if (!orderData) {
        window.modal.error('Order data not found. Please start a new order.', 'Error');
        return;
    }

    console.log('💳 Payment confirmed by user');

    // Show professional verification modal
    showVerificationModal();

    try {
        let savedOrderId = null;

        if (db) {
            console.log('📤 Saving order to Firebase...');

            // Save to Firebase with "pending_verification" status
            const docRef = await db.collection('orders').add({
                orderId: orderData.orderId,
                username: orderData.username,
                email: orderData.email,
                whatsapp: orderData.whatsapp || '',
                package: orderData.package,
                packageName: orderData.packageName,
                followers: orderData.followers,
                amount: orderData.amount,
                amountUSD: orderData.amountUSD,
                status: 'pending_verification',  // Waiting for admin verification
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                paymentConfirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            savedOrderId = docRef.id;
            console.log('✅ Order saved to Firebase with ID:', savedOrderId);
        } else {
            console.log('⚠️ Firebase not available, using demo mode');
            savedOrderId = 'DEMO_' + orderData.orderId;
        }

        // Update order data with database ID
        const confirmedOrder = {
            ...orderData,
            id: savedOrderId,
            status: 'pending_verification',
            paymentConfirmedAt: new Date().toISOString()
        };

        // Store for confirmation page
        sessionStorage.setItem('confirmedOrder', JSON.stringify(confirmedOrder));

        // Clear pending order
        sessionStorage.removeItem('pendingOrder');

        console.log('🔄 Redirecting to confirmation page...');

        // Wait a moment for the modal animation, then redirect
        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 2000);

    } catch (error) {
        console.error('❌ Error saving order:', error);
        hideVerificationModal();

        // Show error alert
        alert('Error processing your order: ' + error.message + '\n\nPlease contact support with your order details.');
    }
}

// Show professional verification modal
function showVerificationModal() {
    // Create modal HTML
    const modalHTML = `
        <div id="verificationModal" class="verification-modal">
            <div class="verification-modal-content">
                <button class="modal-close-btn" onclick="closeModalAndRedirect()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="verification-icon">
                    <svg class="spinner" width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="25" stroke="url(#gradient-spinner)" stroke-width="4" fill="none" stroke-linecap="round"/>
                        <defs>
                            <linearGradient id="gradient-spinner" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#8B5CF6" />
                                <stop offset="100%" stop-color="#EC4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="check-icon">✓</div>
                </div>
                <h2>Verifying Your Payment</h2>
                <p class="verification-message">
                    We are verifying your payment. This usually takes about <strong>1 minute</strong>.
                </p>
                <div class="verification-details">
                    <div class="detail-item">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value">#${orderData.orderId}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Package:</span>
                        <span class="detail-value">${orderData.packageName} (${orderData.followers} followers)</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Amount:</span>
                        <span class="detail-value">₹${orderData.amount}</span>
                    </div>
                </div>
                <div class="verification-promise">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#10B981" fill-opacity="0.2"/>
                        <path d="M6 10l3 3 5-5" stroke="#10B981" stroke-width="2"/>
                    </svg>
                    <p>If payment is successful, followers will be delivered within <strong>5 minutes</strong></p>
                </div>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
                <p class="verification-note">Redirecting automatically in <span id="countdown">2</span> seconds...</p>
                <button class="btn-view-order" onclick="closeModalAndRedirect()">
                    <span>View My Order</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .verification-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 10, 15, 0.95);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .verification-modal-content {
            background: linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(30, 30, 45, 0.9) 100%);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 20px;
            padding: 3rem 2.5rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.4s ease;
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
            position: relative;
        }
        
        .modal-close-btn {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #888;
        }
        
        .modal-close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            color: white;
            transform: scale(1.1);
        }
        
        .verification-icon {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 2rem;
        }
        
        .spinner {
            animation: spin 1.5s linear infinite;
            stroke-dasharray: 157;
            stroke-dashoffset: 50;
        }
        
        .check-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: #10B981;
            opacity: 0;
        }
        
        .verification-modal h2 {
            font-size: 1.75rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .verification-message {
            color: #a0a0b0;
            margin-bottom: 2rem;
            font-size: 1.05rem;
            line-height: 1.6;
        }
        
        .verification-details {
            background: rgba(10, 10, 20, 0.5);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            color: #888;
            font-weight: 600;
        }
        
        .detail-value {
            color: white;
            font-weight: 700;
        }
        
        .verification-promise {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 10px;
            padding: 1rem 1.25rem;
            margin-bottom: 1.5rem;
        }
        
        .verification-promise p {
            margin: 0;
            color: #10B981;
            text-align: left;
            font-size: 0.95rem;
        }
        
        .loading-bar {
            background: rgba(255, 255, 255, 0.1);
            height: 4px;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 1rem;
        }
        
        .loading-progress {
            background: linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%);
            height: 100%;
            width: 0%;
            animation: loadProgress 2s ease-in-out;
        }
        
        .verification-note {
            color: #666;
            font-size: 0.875rem;
            margin: 0 0 1.5rem 0;
        }
        
        #countdown {
            color: #8B5CF6;
            font-weight: 700;
        }
        
        .btn-view-order {
            background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 0.875rem 2rem;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .btn-view-order:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes loadProgress {
            from { width: 0%; }
            to { width: 100%; }
        }
    `;
    document.head.appendChild(style);

    // Start countdown
    let countdown = 2;
    const countdownEl = document.getElementById('countdown');
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownEl) {
            countdownEl.textContent = countdown;
        }
        if (countdown <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function hideVerificationModal() {
    const modal = document.getElementById('verificationModal');
    if (modal) {
        modal.remove();
    }
}

function closeModalAndRedirect() {
    hideVerificationModal();
    window.location.href = 'confirmation.html';
}

// Make functions globally available
window.openUPIApp = openUPIApp;
window.confirmPayment = confirmPayment;
window.closeModalAndRedirect = closeModalAndRedirect;

console.log('✅ payment.js loaded - UPI Payment link ready!');
console.log(`💰 UPI ID configured: ${UPI_ID}`);
