// Admin API Configuration
// This file centralizes all admin API endpoint configurations
// Use environment variables for production deployment

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://your-backend-url.com'  // 👈 REPLACE with your production backend URL
    : 'http://localhost:3000';

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

console.log('🔧 Admin API Config loaded:', API_BASE_URL);
