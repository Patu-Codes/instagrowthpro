// API Client - Clean interface to backend server
// PRODUCTION ONLY - NO LOCAL REFERENCES

const API_URL = 'https://instagrowthpro-backend.onrender.com/api';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Helper for API calls
    async request(endpoint, options = {}) {
        console.log('🌐 API request called:', endpoint);
        console.log('📦 Options:', options);
        console.log('📦 Options.body:', options.body);

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers
            }
        };

        if (options.body) {
            const bodyString = JSON.stringify(options.body);
            console.log('📤 Stringified body:', bodyString);
            console.log('📤 Body contains profileLink:', bodyString.includes('profileLink'));
            config.body = bodyString;
        }

        console.log('🚀 Final fetch config:', {
            url: `${API_URL}${endpoint}`,
            method: config.method,
            bodyLength: config.body ? config.body.length : 0
        });

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ============ PROFILE METHODS ============

    async createProfile(profileData) {
        const data = await this.request('/profiles', {
            method: 'POST',
            body: profileData
        });
        return data;
    }

    async login(username, password) {
        const data = await this.request('/login', {
            method: 'POST',
            body: { username, password }
        });

        // Save token and profile
        if (data.token) {
            this.token = data.token;

            // Store in localStorage (for immediate use)
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.profile));

            // ALSO store in cookie (survives browser privacy settings)
            this.setCookie('sessionToken', data.token, 30); // 30 days
            this.setCookie('sessionUser', JSON.stringify(data.profile), 30);

            console.log('✅ Session saved to localStorage AND cookies');
        }

        return data;
    }

    // Cookie helper methods
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }

    async getProfile(profileId) {
        return await this.request(`/profiles/${profileId}`);
    }

    async getAllProfiles() {
        return await this.request('/profiles');
    }

    // ============ ORDER METHODS ============

    async createOrder(orderData) {
        console.log('🌐 API createOrder called with:', orderData);
        console.log('🔗 orderData.profileLink:', orderData.profileLink);
        console.log('📝 Sending to /orders endpoint...');

        const result = await this.request('/orders', {
            method: 'POST',
            body: orderData
        });

        console.log('✅ API response:', result);
        return result;
    }

    async getAllOrders() {
        return await this.request('/orders');
    }

    async getProfileOrders(profileId) {
        return await this.request(`/profiles/${profileId}/orders`);
    }

    async updateOrderStatus(orderId, status) {
        return await this.request(`/orders/${orderId}/status`, {
            method: 'PATCH',
            body: { status }
        });
    }

    // ============ STATS ============

    async getStats() {
        return await this.request('/stats');
    }

    // ============ AUTH ============

    logout() {
        this.token = null;

        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');

        // Clear cookies
        this.deleteCookie('sessionToken');
        this.deleteCookie('sessionUser');

        console.log('✅ Session cleared from localStorage AND cookies');
    }

    isLoggedIn() {
        // Check localStorage first
        let currentUser = localStorage.getItem('currentUser');

        // If not in localStorage, check cookies
        if (!currentUser) {
            currentUser = this.getCookie('sessionUser');
            if (currentUser) {
                // Restore to localStorage from cookie
                localStorage.setItem('currentUser', currentUser);
                const token = this.getCookie('sessionToken');
                if (token) {
                    localStorage.setItem('authToken', token);
                }
                console.log('✅ Session restored from cookies');
            }
        }

        return !!currentUser;
    }

    getCurrentUser() {
        // Check localStorage first
        let user = localStorage.getItem('currentUser');

        // If not in localStorage, check cookies
        if (!user) {
            user = this.getCookie('sessionUser');
            if (user) {
                // Restore to localStorage from cookie
                localStorage.setItem('currentUser', user);
                const token = this.getCookie('sessionToken');
                if (token) {
                    localStorage.setItem('authToken', token);
                    this.token = token;
                }
                console.log('✅ Session restored from cookies');
            }
        }

        return user ? JSON.parse(user) : null;
    }
}

// Create global instance
window.api = new APIClient();

console.log('✅ API Client loaded');
