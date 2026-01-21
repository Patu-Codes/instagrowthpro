console.log('🚀 ORDER.JS STARTING...');

// Production API Base
const API_BASE = 'https://instagrowthpro-backend.onrender.com';

// Check if user is logged in (simple profile system)
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    console.log('⚠️ No user logged in - showing auth gate');

    // Use professional modal instead of browser alert
    setTimeout(() => {
        if (window.authGate) {
            window.authGate.showLoginRequiredModal();
        } else {
            // Fallback if auth-gate.js not loaded yet
            setTimeout(() => {
                if (window.authGate) {
                    window.authGate.showLoginRequiredModal();
                } else {
                    // Last resort fallback
                    if (confirm('You must create a profile to place an order. Create one now?')) {
                        window.location.href = 'register.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }
            }, 500);
        }
    }, 300);
} else {
    console.log('✅ User logged in:', currentUser.username);
}

// Package pricing data
const packages = {
    demo: { name: 'Demo', followers: 50, price: 130, priceUSD: 2 },
    starter: { name: 'Starter', followers: 100, price: 349, priceUSD: 5 },
    growth: { name: 'Growth', followers: 200, price: 699, priceUSD: 10 },
    pro: { name: 'Pro', followers: 500, price: 1699, priceUSD: 24 },
    elite: { name: 'Elite', followers: 1000, price: 3099, priceUSD: 45 }
};

console.log('✅ Packages loaded');

// Update order summary when package is selected
function updateSummary() {
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    if (selectedPackage) {
        const packageData = packages[selectedPackage.value];
        if (document.getElementById('summary-package')) {
            document.getElementById('summary-package').textContent = packageData.name;
            document.getElementById('summary-followers').textContent = packageData.followers;
            document.getElementById('summary-price').textContent = `₹${packageData.price}`;
        }
    }
}

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `IG${timestamp}${random}`.toUpperCase();
}

// MAIN FORM HANDLER
function handleOrderSubmit(e) {
    console.log('🔥🔥🔥 handleOrderSubmit CALLED! 🔥🔥🔥');

    // Prevent form submission
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const username = document.getElementById('username').value.trim().replace('@', '');
    const profileLink = document.getElementById('profileLink').value.trim();
    const email = document.getElementById('email').value.trim();
    const selectedPackage = document.querySelector('input[name="package"]:checked');

    console.log('📊 Username:', username);
    console.log('📊 Profile Link:', profileLink);
    console.log('📊 Email:', email);
    console.log('📊 Package:', selectedPackage?.value);

    if (!username || !profileLink) {
        window.modal.error('Please fill in all required fields', 'Required');
        return false;
    }

    if (!selectedPackage) {
        window.modal.error('Please select a package', 'Required');
        return false;
    }

    // Check if Demo is selected and Instagram ID has already used it
    if (selectedPackage.value === 'demo') {
        console.log('⚠️ Demo selected - checking Instagram ID...');

        // Synchronous check using fetch with await would be better, but using callback
        fetch(`${API_BASE}/api/demo-usage-instagram/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.used) {
                    // Show professional modal instead of alert
                    showDemoUsedModal(username);

                    // Disable demo and switch to starter
                    const demoInput = document.querySelector('input[name="package"][value="demo"]');
                    const starterInput = document.querySelector('input[name="package"][value="starter"]');
                    if (demoInput) demoInput.disabled = true;
                    if (starterInput) {
                        starterInput.checked = true;
                        updateSummary();
                    }

                    return false;
                } else {
                    // Instagram ID is clear, proceed with order
                    proceedWithOrder();
                }
            })
            .catch(err => {
                console.error('Error checking Instagram demo usage:', err);
                showErrorModal('Error validating Demo usage. Please try again.');
                return false;
            });

        return false; // Prevent default submission, will proceed in callback
    }

    // Not demo, proceed normally
    proceedWithOrder();
    return false;
}

function proceedWithOrder() {
    const username = document.getElementById('username').value.trim().replace('@', '');
    const profileLink = document.getElementById('profileLink').value.trim();
    const email = document.getElementById('email').value.trim();
    const selectedPackage = document.querySelector('input[name="package"]:checked');

    const packageData = packages[selectedPackage.value];

    // Firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyCJc3ZLiR9BSB01hOaSRHO3lSmLf0le8zw",
        authDomain: "instagrow-x.firebaseapp.com",
        projectId: "instagrow-x",
        storageBucket: "instagrow-x.firebasestorage.app",
        messagingSenderId: "320041630068",
        appId: "1:320041630068:web:01cde8140ceb3750ee9421",
        measurementId: "G-WMVHQCMEZS"
    };

    // Create order object
    const order = {
        orderId: generateOrderId(),
        profileId: currentUser.id,  // Link to profile
        profileUsername: currentUser.username,
        username: username,
        profileLink: profileLink,
        email: email,
        package: selectedPackage.value,
        packageName: packageData.name,
        followers: packageData.followers,
        amount: packageData.price,
        amountUSD: packageData.priceUSD,
        status: 'pending_verification',
        createdAt: new Date().toISOString()
    };

    console.log('📦 Order object created:', order);
    console.log('🔗 ProfileLink in order:', order.profileLink);
    console.log('🔗 ProfileLink length:', order.profileLink ? order.profileLink.length : 0);
    console.log('💾 Attempting to save to sessionStorage...');

    // Save to sessionStorage
    try {
        const orderString = JSON.stringify(order);
        console.log('📝 Stringified order:', orderString);
        console.log('📝 String contains profileLink:', orderString.includes('profileLink'));

        sessionStorage.setItem('pendingOrder', orderString);
        console.log('✅✅✅ SAVED TO SESSIONSTORAGE! ✅✅✅');

        // Verify it was saved
        const verify = sessionStorage.getItem('pendingOrder');
        console.log('🔍 Verification - Data exists:', !!verify);
        console.log('🔍 Verification - Data length:', verify ? verify.length : 0);
        const verifyObj = JSON.parse(verify);
        console.log('🔍 Verification - ProfileLink:', verifyObj.profileLink);

    } catch (err) {
        console.error('❌ SessionStorage error:', err);
        window.modal.error('Error: ' + err.message, 'Error');
        return false;
    }

    console.log('🚀🚀🚀 REDIRECTING TO PAYMENT PAGE 🚀🚀🚀');

    // Redirect
    setTimeout(() => {
        console.log('⏰ Timeout reached, redirecting NOW...');
        window.location.href = 'payment.html';
    }, 500);

    return false;
}

// Make it globally available
window.handleOrderSubmit = handleOrderSubmit;
window.updateSummary = updateSummary;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get('plan');

    // Update package selection based on URL parameter
    if (selectedPlan && packages[selectedPlan]) {
        const radio = document.querySelector(`input[name="package"][value="${selectedPlan}"]`);
        if (radio) {
            radio.checked = true;
            updateSummary();
        }
    }

    // Check if user has already used demo
    if (currentUser) {
        fetch(`${API_BASE}/api/demo-usage/${currentUser.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.used) {
                    console.log('⚠️ User has already used Demo plan');
                    const demoInput = document.querySelector('input[name="package"][value="demo"]');
                    const demoCard = demoInput?.closest('.package-option');

                    if (demoInput && demoCard) {
                        // Disable the demo option
                        demoInput.disabled = true;

                        // Update badge to show USED
                        const badge = demoCard.querySelector('.package-badge');
                        if (badge) {
                            badge.textContent = '🔒 ALREADY USED';
                            badge.style.background = 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)';
                        }

                        // Add visual styling for disabled state
                        const packageCard = demoCard.querySelector('.package-card');
                        if (packageCard) {
                            packageCard.style.opacity = '0.5';
                            packageCard.style.cursor = 'not-allowed';
                            packageCard.style.borderColor = '#6B7280';
                        }

                        // If demo was selected, switch to starter
                        if (demoInput.checked) {
                            const starterInput = document.querySelector('input[name="package"][value="starter"]');
                            if (starterInput) {
                                starterInput.checked = true;
                                updateSummary();
                            }
                        }
                    }
                }
            })
            .catch(err => console.error('Error checking demo usage:', err));
    }

    // Add change listeners
    document.querySelectorAll('input[name="package"]').forEach(radio => {
        radio.addEventListener('change', updateSummary);
    });

    // Initialize summary
    updateSummary();

    console.log('✅ Package listeners attached');
});

// Professional modal for Demo already used
function showDemoUsedModal(username) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10, 10, 15, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid rgba(239, 68, 68, 0.3);
            border-radius: 24px;
            padding: 2.5rem;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 25px 60px rgba(239, 68, 68, 0.3);
            animation: slideUp 0.3s ease;
        ">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
                ">
                    🔒
                </div>
                <h2 style="
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #EF4444;
                    margin: 0 0 1rem 0;
                ">Demo Plan Already Used!</h2>
            </div>

            <div style="
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 12px;
                padding: 1.25rem;
                margin-bottom: 1.5rem;
            ">
                <p style="
                    color: white;
                    font-size: 1rem;
                    line-height: 1.6;
                    margin: 0 0 1rem 0;
                ">
                    The Instagram account <strong style="color: #EC4899;">@${username}</strong> has already received the Demo plan.
                </p>
                <p style="
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.875rem;
                    line-height: 1.6;
                    margin: 0;
                ">
                    Each Instagram account can only use the Demo plan <strong>once</strong>. Please select a different package to continue.
                </p>
            </div>

            <button id="closeModalBtn" style="
                width: 100%;
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 1rem 2rem;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                Understood, Select Another Package
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners after modal is in DOM
    const closeBtn = modal.querySelector('#closeModalBtn');
    closeBtn.addEventListener('click', () => modal.remove());
    closeBtn.addEventListener('mouseover', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)';
    });
    closeBtn.addEventListener('mouseout', function () {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
}

// Professional modal for errors
function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10, 10, 15, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 24px;
            padding: 2rem;
            max-width: 400px;
            width: 100%;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <p style="color: white; font-size: 1rem; margin-bottom: 1.5rem;">${message}</p>
            <button id="errorCloseBtn" style="
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 0.75rem 2rem;
                font-weight: 700;
                cursor: pointer;
            ">OK</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#errorCloseBtn').addEventListener('click', () => modal.remove());
}

console.log('✅✅✅ ORDER.JS LOADED SUCCESSFULLY ✅✅✅');
console.log('✅ handleOrderSubmit function is ready:', typeof window.handleOrderSubmit);
