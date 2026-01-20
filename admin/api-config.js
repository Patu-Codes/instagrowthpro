// Admin API Configuration
// This file centralizes all admin API endpoint configurations
// Uses window.location.origin to automatically work in both local and production

// Dynamic API Base - works in local dev and production
const API_BASE_URL = window.location.origin;

const ADMIN_API_ENDPOINTS = {
    baseURL: `${API_BASE_URL}/api`,

    // Profile/User endpoints
    profiles: `${API_BASE_URL}/api/profiles`,
    users: (userId) => `${API_BASE_URL}/api/users/${userId}`,

    // Order endpoints
    orders: `${API_BASE_URL}/api/orders`,
    orderStatus: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/status`,
    deleteOrder: (orderId) => `${API_BASE_URL}/api/orders/${orderId}`,

    // Stats
    stats: `${API_BASE_URL}/api/stats`,

    // Chat endpoints
    activeChats: `${API_BASE_URL}/api/chat/active-chats`,
    chat: (userId) => `${API_BASE_URL}/api/chat/${userId}`,
    chatSend: `${API_BASE_URL}/api/chat/send`,
    markRead: `${API_BASE_URL}/api/chat/mark-read`
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ADMIN_API_ENDPOINTS;
}

// Make available globally
window.ADMIN_API_ENDPOINTS = ADMIN_API_ENDPOINTS;
window.API_BASE_URL = API_BASE_URL;

console.log('🔧 Admin API Config loaded for:', API_BASE_URL);
