// Hybrid Data Sync - localStorage + Firebase Cloud Backup
// Best of both worlds: Fast local storage + Reliable cloud backup

console.log('🔄 Hybrid Data Sync Starting...');

class HybridDataSync {
    constructor() {
        this.syncInterval = null;
        this.lastSyncTime = 0;
        this.isSyncing = false;
    }

    // Initialize sync system
    async init() {
        console.log('🚀 Initializing Hybrid Sync...');

        // Load data from cloud on startup
        await this.loadFromCloud();

        // Start auto-sync every 10 seconds
        this.startAutoSync();

        // Sync before page unload
        window.addEventListener('beforeunload', () => {
            this.syncToCloud();
        });

        console.log('✅ Hybrid Sync initialized');
    }

    // Load data from Firebase to localStorage
    async loadFromCloud() {
        if (!window.firebaseAvailable) {
            console.log('⚠️ Cloud backup not available, using localStorage only');
            return;
        }

        try {
            console.log('📥 Loading data from cloud...');

            const db = window.firebaseDB;
            const deviceId = localStorage.getItem('deviceId') || 'DEVICE_' + Date.now();

            // Get profiles for this device
            const profilesRef = db.collection('profiles').where('deviceId', '==', deviceId);
            const snapshot = await profilesRef.get();

            if (!snapshot.empty) {
                const cloudProfiles = [];
                snapshot.forEach(doc => {
                    cloudProfiles.push({ id: doc.id, ...doc.data() });
                });

                // Merge with local profiles
                const localProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');
                const merged = this.mergeProfiles(localProfiles, cloudProfiles);

                // Save merged data to localStorage
                localStorage.setItem('profiles', JSON.stringify(merged));

                console.log(`✅ Loaded ${cloudProfiles.length} profiles from cloud`);
            } else {
                console.log('ℹ️ No cloud backup found for this device');
            }

        } catch (error) {
            console.error('❌ Error loading from cloud:', error);
        }
    }

    // Sync data from localStorage to Firebase
    async syncToCloud() {
        if (!window.firebaseAvailable || this.isSyncing) {
            return;
        }

        try {
            this.isSyncing = true;
            const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

            if (profiles.length === 0) {
                console.log('ℹ️ No profiles to sync');
                this.isSyncing = false;
                return;
            }

            console.log(`🔄 Syncing ${profiles.length} profiles to cloud...`);

            const db = window.firebaseDB;
            const batch = db.batch();

            for (const profile of profiles) {
                const docRef = db.collection('profiles').doc(profile.id);
                batch.set(docRef, {
                    ...profile,
                    lastSynced: new Date().toISOString()
                }, { merge: true });
            }

            await batch.commit();

            this.lastSyncTime = Date.now();
            console.log('✅ Cloud sync successful');

        } catch (error) {
            console.error('❌ Error syncing to cloud:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    // Merge local and cloud profiles (cloud takes precedence for conflicts)
    mergeProfiles(localProfiles, cloudProfiles) {
        const merged = [...cloudProfiles];

        // Add local profiles that don't exist in cloud
        for (const localProfile of localProfiles) {
            const existsInCloud = cloudProfiles.find(p => p.id === localProfile.id);
            if (!existsInCloud) {
                merged.push(localProfile);
            }
        }

        return merged;
    }

    // Start automatic sync every 10 seconds
    startAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.syncInterval = setInterval(() => {
            this.syncToCloud();
        }, 10000); // 10 seconds

        console.log('⏰ Auto-sync started (every 10 seconds)');
    }

    // Stop auto-sync
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // Save profile (localStorage + trigger sync)
    saveProfile(profile) {
        // Get existing profiles
        const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

        // Check if profile exists
        const existingIndex = profiles.findIndex(p => p.id === profile.id);

        if (existingIndex >= 0) {
            // Update existing
            profiles[existingIndex] = {
                ...profiles[existingIndex],
                ...profile,
                updatedAt: new Date().toISOString()
            };
        } else {
            // Add new
            profiles.push({
                ...profile,
                createdAt: new Date().toISOString()
            });
        }

        // Save to localStorage
        localStorage.setItem('profiles', JSON.stringify(profiles));

        console.log('💾 Profile saved locally:', profile.username);

        // Trigger immediate cloud sync
        setTimeout(() => this.syncToCloud(), 100);

        return profile;
    }

    // Get all profiles (from localStorage)
    getProfiles() {
        return JSON.parse(localStorage.getItem('profiles') || '[]');
    }

    // Get single profile by ID
    getProfile(profileId) {
        const profiles = this.getProfiles();
        return profiles.find(p => p.id === profileId);
    }

    // Update profile orders
    updateProfileOrders(profileId, orders) {
        const profiles = this.getProfiles();
        const profileIndex = profiles.findIndex(p => p.id === profileId);

        if (profileIndex >= 0) {
            profiles[profileIndex].orders = orders;
            profiles[profileIndex].updatedAt = new Date().toISOString();

            localStorage.setItem('profiles', JSON.stringify(profiles));

            // Trigger sync
            setTimeout(() => this.syncToCloud(), 100);

            console.log('✅ Orders updated for profile:', profileId);
            return true;
        }

        return false;
    }

    // Force sync now
    forceSyncNow() {
        console.log('🔄 Force syncing...');
        this.syncToCloud();
    }
}

// Create global instance
window.hybridSync = new HybridDataSync();

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    window.hybridSync.init();
});

// Also init immediately if DOM already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.hybridSync.init();
}

console.log('✅ Hybrid Data Sync loaded');
