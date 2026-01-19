// Professional Order Details Modal Functions
// Add to profile-page.js

function viewOrderDetails(order) {
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    const date = new Date(order.createdAt).toLocaleString();

    // Helper function to get package name from package code
    function getPackageName(packageCode, followers) {
        const packageMap = {
            'demo': 'Demo',
            'starter': 'Starter',
            'growth': 'Growth',
            'pro': 'Pro',
            'elite': 'Elite'
        };

        const name = packageMap[packageCode] || packageCode;
        return followers ? `${name} (${followers} followers)` : name;
    }

    // Global function to show order invoice modal
    // Create professional invoice modal
    const modalHTML = `
        <div id="orderInvoiceModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);">
                
                <!-- Header -->
                <div style="padding: 2rem; border-bottom: 1px solid rgba(139, 92, 246, 0.2); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="url(#grad1)" stroke-width="2"/>
                                <circle cx="20" cy="20" r="12" fill="url(#grad1)"/>
                                <defs>
                                    <linearGradient id="grad1" x1="0" y1="0" x2="40" y2="40">
                                        <stop offset="0%" stop-color="#8B5CF6"/>
                                        <stop offset="100%" stop-color="#EC4899"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div>
                                <h2 style="margin: 0; font-size: 1.5rem; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">InstaGrowth Pro</h2>
                                <p style="margin: 0; color: #a0a0b0; font-size: 0.875rem;">Order Invoice</p>
                            </div>
                        </div>
                    </div>
                    <button onclick="closeInvoiceModal()" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #EF4444; width: 40px; height: 40px; border-radius: 8px; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>

                <!-- Invoice Content -->
                <div style="padding: 2rem;">
                    
                    <!-- Order ID & Status -->
                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="color: #a0a0b0; font-size: 0.875rem; margin-bottom: 0.25rem;">Order ID</div>
                                <div style="font-size: 1.25rem; font-weight: 700; font-family: monospace;">#${order.orderId}</div>
                            </div>
                            <div id="orderStatusBadge">
                                <span class="status-badge ${statusClass}" style="font-size: 0.875rem; padding: 0.5rem 1rem;">${statusText}</span>
                            </div>
                        </div>
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(139, 92, 246, 0.2); color: #a0a0b0; font-size: 0.875rem;">
                            📅 ${date}
                        </div>
                    </div>

                    <!-- Customer Details -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: #8B5CF6;">Customer Details</h3>
                        <div style="display: grid; gap: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
                                <span style="color: #a0a0b0;">Profile</span>
                                <strong>@${order.profileUsername}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
                                <span style="color: #a0a0b0;">Instagram</span>
                                <strong>@${order.username}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
                                <span style="color: #a0a0b0;">Email</span>
                                <strong>${order.email}</strong>
                            </div>
                            ${order.whatsapp ? `
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
                                <span style="color: #a0a0b0;">WhatsApp</span>
                                <strong>${order.whatsapp}</strong>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Order Details -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: #8B5CF6;">Order Details</h3>
                        <div style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <span style="color: #a0a0b0;">Package</span>
                                <strong>${order.packageName || getPackageName(order.package, order.followers) || 'N/A'}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <span style="color: #a0a0b0;">Followers</span>
                                <strong style="color: #8B5CF6;">${(order.followers || 0).toLocaleString()}</strong>
                            </div>
                            <div style="border-top: 1px dashed rgba(139, 92, 246, 0.3); margin: 1rem 0; padding-top: 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 1.125rem; font-weight: 600;">Total Amount</span>
                                    <strong style="font-size: 1.5rem; color: #10B981;">₹${order.amount}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Timeline -->
                    <div style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.1); border-radius: 12px; padding: 1.5rem;">
                        <h3 style="font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem; color: #a0a0b0;">ORDER PROGRESS</h3>
                        <div style="display: flex; gap: 0.5rem;">
                            <div style="flex: 1; text-align: center;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center; ${order.status === 'pending_verification' || order.status === 'processing' || order.status === 'completed' ? 'background: #F59E0B;' : 'background: rgba(255,255,255,0.1);'}">
                                    ${order.status === 'pending_verification' || order.status === 'processing' || order.status === 'completed' ? '⏳' : '1'}
                                </div>
                                <div style="font-size: 0.75rem; color: #a0a0b0;">Verifying</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center; ${order.status === 'processing' || order.status === 'completed' ? 'background: #3B82F6;' : 'background: rgba(255,255,255,0.1);'}">
                                    ${order.status === 'processing' || order.status === 'completed' ? '🔄' : '2'}
                                </div>
                                <div style="font-size: 0.75rem; color: #a0a0b0;">Processing</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center; ${order.status === 'completed' ? 'background: #10B981;' : 'background: rgba(255,255,255,0.1);'}">
                                    ${order.status === 'completed' ? '✅' : '3'}
                                </div>
                                <div style="font-size: 0.75rem; color: #a0a0b0;">Completed</div>
                            </div>
                        </div>
                    </div>

                    <!-- Auto-refresh notice -->
                    <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; font-size: 0.875rem; color: #3B82F6; text-align: center;">
                        <span id="autoRefreshText">🔄 Checking for status updates every 3 seconds...</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('orderInvoiceModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Start auto-refresh for status updates
    window.currentOrderId = order.orderId;
    window.orderRefreshInterval = setInterval(() => checkOrderStatusUpdate(order.orderId), 3000);
}

function checkOrderStatusUpdate(orderId) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get profiles
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const userProfile = profiles.find(p => p.id === currentUser.id);
    if (!userProfile || !userProfile.orders) return;

    // Find order
    const order = userProfile.orders.find(o => o.orderId === orderId);
    if (!order) return;

    // Update status badge if changed
    const statusBadge = document.getElementById('orderStatusBadge');
    if (statusBadge) {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        statusBadge.innerHTML = `<span class="status-badge ${statusClass}" style="font-size: 0.875rem; padding: 0.5rem 1rem;">${statusText}</span>`;
    }

    // Update auto-refresh text
    const refreshText = document.getElementById('autoRefreshText');
    if (refreshText) {
        const now = new Date().toLocaleTimeString();
        refreshText.textContent = `✅ Last updated: ${now} - Status: ${getStatusText(order.status)}`;
    }
}

function closeInvoiceModal() {
    const modal = document.getElementById('orderInvoiceModal');
    if (modal) {
        modal.remove();
    }

    // Stop auto-refresh
    if (window.orderRefreshInterval) {
        clearInterval(window.orderRefreshInterval);
    }

    // Reload orders to show updated status in main table
    loadOrders();
}

// Make functions available globally
window.viewOrderDetails = viewOrderDetails;
window.closeInvoiceModal = closeInvoiceModal;
window.checkOrderStatusUpdate = checkOrderStatusUpdate;
