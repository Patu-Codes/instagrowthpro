// API Configuration
// This file centralizes all API endpoint configurations
// Use environment variables for production deployment

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://your-backend-url.com'  // 👈 REPLACE with your production backend URL
    : 'http://localhost:3000';

const API_ENDPOINTS = {
    baseURL: `${API_BASE_URL}/api`,

    // Profile endpoints
    profiles: `${API_BASE_URL}/api/profiles`,
    login: `${API_BASE_URL}/api/login`,

    // Order endpoints
    orders: `${API_BASE_URL}/api/orders`,
    stats: `${API_BASE_URL}/api/stats`,

    // Instagram verification
    verifyInstagram: `${API_BASE_URL}/api/verify-instagram`,

    // Demo usage
    demoUsage: (profileId) => `${API_BASE_URL}/api/demo-usage/${profileId}`,
    demoUsageInstagram: (username) => `${API_BASE_URL}/api/demo-usage-instagram/${username}`,

    // Chat endpoints
    chat: (userId) => `${API_BASE_URL}/api/chat/${userId}`,
    chatSend: `${API_BASE_URL}/api/chat/send`,
    activeChats: `${API_BASE_URL}/api/chat/active-chats`,
    markRead: `${API_BASE_URL}/api/chat/mark-read`,

    // Contact
    contactSend: `${API_BASE_URL}/api/contact/send`,

    // Users (admin)
    users: (userId) => `${API_BASE_URL}/api/users/${userId}`,

    // Order status
    orderStatus: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/status`,
    deleteOrder: (orderId) => `${API_BASE_URL}/api/orders/${orderId}`
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_ENDPOINTS;
}

// Make available globally
window.API_ENDPOINTS = API_ENDPOINTS;
window.API_BASE_URL = API_BASE_URL;

console.log('🔧 API Config loaded:', API_BASE_URL);
