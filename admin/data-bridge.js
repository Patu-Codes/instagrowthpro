// Cloud Data Bridge - Admin panel reads from Firestore
// Works across different ports/origins

console.log('☁️ Cloud Data Bridge starting...');

class CloudDataBridge {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    // Initialize Firebase
    async init() {
        if (this.initialized) return;

        try {
            // Firebase config - same as main site
            const firebaseConfig = {
                apiKey: "AIzaSyCJc3ZLiR9BSB01hOaSRHO3lSmLf0le8zw",
                authDomain: "instagrow-x.firebaseapp.com",
                projectId: "instagrow-x",
                storageBucket: "instagrow-x.firebasestorage.app",
                messagingSenderId: "320041630068",
                appId: "1:320041630068:web:01cde8140ceb3750ee9421",
                measurementId: "G-WMVHQCMEZS"
            };

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.db = firebase.firestore();
            this.initialized = true;

            console.log('✅ Cloud Data Bridge initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Firebase:', error);
        }
    }

    // Get all profiles from Firestore
    async getProfiles() {
        if (!this.initialized) {
            await this.init();
        }

        try {
            console.log('📥 Loading profiles from Firestore...');

            const snapshot = await this.db.collection('profiles').get();

            const profiles = [];
            snapshot.forEach(doc => {
                profiles.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log(`✅ Loaded ${profiles.length} profiles from cloud`);
            return profiles;

        } catch (error) {
            console.error('❌ Error loading profiles:', error);
            return [];
        }
    }

    // Get single profile by ID
    async getProfile(profileId) {
        if (!this.initialized) {
            await this.init();
        }

        try {
            const doc = await this.db.collection('profiles').doc(profileId).get();

            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }

            return null;
        } catch (error) {
            console.error('❌ Error loading profile:', error);
            return null;
        }
    }

    // Update profile (save changes)
    async saveProfile(profile) {
        if (!this.initialized) {
            await this.init();
        }

        try {
            console.log('💾 Saving profile to Firestore...', profile.id);

            await this.db.collection('profiles').doc(profile.id).set({
                ...profile,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Profile saved to cloud');
            return true;

        } catch (error) {
            console.error('❌ Error saving profile:', error);
            return false;
        }
    }

    // Update order status in a profile
    async updateOrderStatus(profileId, orderId, newStatus) {
        if (!this.initialized) {
            await this.init();
        }

        try {
            console.log(`🔄 Updating order ${orderId} status to ${newStatus}...`);

            // Get profile
            const profile = await this.getProfile(profileId);

            if (!profile || !profile.orders) {
                console.error('❌ Profile or orders not found');
                return false;
            }

            // Update order status
            const orderIndex = profile.orders.findIndex(o => o.orderId === orderId);

            if (orderIndex >= 0) {
                profile.orders[orderIndex].status = newStatus;
                profile.orders[orderIndex].updatedAt = new Date().toISOString();

                // Save back to Firestore
                await this.saveProfile(profile);

                console.log('✅ Order status updated');
                return true;
            }

            console.error('❌ Order not found');
            return false;

        } catch (error) {
            console.error('❌ Error updating order status:', error);
            return false;
        }
    }

    // Get all orders from all profiles
    async getAllOrders() {
        const profiles = await this.getProfiles();

        const allOrders = [];

        profiles.forEach(profile => {
            if (profile.orders && profile.orders.length > 0) {
                profile.orders.forEach(order => {
                    allOrders.push({
                        ...order,
                        profileId: profile.id,
                        profileUsername: profile.username
                    });
                });
            }
        });

        // Sort by date (newest first)
        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return allOrders;
    }

    // Get statistics
    async getStats() {
        const profiles = await this.getProfiles();
        const orders = await this.getAllOrders();

        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending_verification').length;
        const processingOrders = orders.filter(o => o.status === 'processing').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;

        return {
            totalUsers: profiles.length,
            totalOrders: orders.length,
            totalRevenue: totalRevenue,
            pendingOrders: pendingOrders,
            processingOrders: processingOrders,
            completedOrders: completedOrders
        };
    }
}

// Create global instance
window.cloudBridge = new CloudDataBridge();

// Helper functions for backward compatibility
window.getProfiles = async () => await window.cloudBridge.getProfiles();
window.getAllOrders = async () => await window.cloudBridge.getAllOrders();
window.updateOrderStatus = async (profileId, orderId, status) =>
    await window.cloudBridge.updateOrderStatus(profileId, orderId, status);

// Auto-initialize
window.cloudBridge.init();

console.log('✅ Cloud Data Bridge loaded');
