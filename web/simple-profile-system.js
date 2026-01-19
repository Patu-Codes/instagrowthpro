// Simple Profile System - localStorage Only (No Firestore dependency)
// Reliable, works offline, with import/export for backup

console.log('💾 Simple Profile System Loading...');

class SimpleProfileSystem {
    constructor() {
        this.STORAGE_KEY = 'profiles';
        this.init();
    }

    init() {
        // Ensure profiles array exists
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        }

        // Auto-backup every 5 minutes
        setInterval(() => this.autoBackup(), 5 * 60 * 1000);

        console.log('✅ Simple Profile System ready');
    }

    // Get all profiles
    getProfiles() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    // Save profile
    saveProfile(profile) {
        const profiles = this.getProfiles();
        const existingIndex = profiles.findIndex(p => p.id === profile.id);

        if (existingIndex >= 0) {
            profiles[existingIndex] = profile;
        } else {
            profiles.push(profile);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
        this.autoBackup(); // Backup after every save

        return profile;
    }

    // Get single profile
    getProfile(profileId) {
        const profiles = this.getProfiles();
        return profiles.find(p => p.id === profileId);
    }

    // Update order status
    updateOrderStatus(profileId, orderId, newStatus) {
        const profiles = this.getProfiles();
        const profile = profiles.find(p => p.id === profileId);

        if (profile && profile.orders) {
            const order = profile.orders.find(o => o.orderId === orderId);
            if (order) {
                order.status = newStatus;
                order.updatedAt = new Date().toISOString();
                this.saveProfile(profile);
                return true;
            }
        }

        return false;
    }

    // Auto-backup to download
    autoBackup() {
        try {
            const data = {
                profiles: this.getProfiles(),
                backupDate: new Date().toISOString(),
                version: '1.0'
            };

            // Store in sessionStorage as backup
            sessionStorage.setItem('profilesBackup', JSON.stringify(data));

            console.log('✅ Auto-backup created');
        } catch (error) {
            console.error('Backup failed:', error);
        }
    }

    // Manual export
    exportToFile() {
        const data = {
            profiles: this.getProfiles(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `profiles-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        return data.profiles.length;
    }

    // Import from file
    importFromFile(fileContent) {
        try {
            const data = JSON.parse(fileContent);

            if (data.profiles && Array.isArray(data.profiles)) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.profiles));
                return data.profiles.length;
            }

            throw new Error('Invalid backup file format');
        } catch (error) {
            throw new Error('Failed to import: ' + error.message);
        }
    }

    // Restore from session backup (if browser cleared localStorage)
    restoreFromSession() {
        const backup = sessionStorage.getItem('profilesBackup');
        if (backup) {
            const data = JSON.parse(backup);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.profiles));
            return data.profiles.length;
        }
        return 0;
    }
}

// Create global instance
window.simpleProfileSystem = new SimpleProfileSystem();

// Backward compatibility helpers
window.getProfiles = () => window.simpleProfileSystem.getProfiles();
window.saveProfile = (profile) => window.simpleProfileSystem.saveProfile(profile);

console.log('✅ Simple Profile System loaded');
