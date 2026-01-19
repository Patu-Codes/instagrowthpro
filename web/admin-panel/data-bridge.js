// Shared Data Bridge - Access data from parent directory
// This allows admin panel to access main website's data

class DataBridge {
    constructor() {
        // Try to access parent window's localStorage (if opened from main site)
        this.useParentStorage = false;

        try {
            if (window.opener && window.opener.localStorage) {
                this.storage = window.opener.localStorage;
                this.useParentStorage = true;
                console.log('✅ Using parent window localStorage');
            }
        } catch (e) {
            console.log('⚠️ Cannot access parent localStorage, using iframe bridge');
        }
    }

    // Get profiles from main website
    getProfiles() {
        if (this.useParentStorage) {
            return JSON.parse(this.storage.getItem('profiles') || '[]');
        }

        // Fallback: Try to load from iframe pointing to main site
        return this.loadFromMainSite();
    }

    // Save profiles back to main website
    saveProfiles(profiles) {
        if (this.useParentStorage) {
            this.storage.setItem('profiles', JSON.stringify(profiles));
            return true;
        }

        return this.saveToMainSite(profiles);
    }

    // Load data via iframe bridge
    loadFromMainSite() {
        // Check if bridge iframe exists
        let bridge = document.getElementById('storageBridge');

        if (!bridge) {
            bridge = document.createElement('iframe');
            bridge.id = 'storageBridge';
            bridge.src = 'http://localhost:8000/storage-bridge.html';
            bridge.style.display = 'none';
            document.body.appendChild(bridge);

            console.log('📡 Created storage bridge iframe');
        }

        // Try to get data from iframe
        try {
            const data = bridge.contentWindow.localStorage.getItem('profiles');
            return JSON.parse(data || '[]');
        } catch (e) {
            console.error('❌ Cannot access main site localStorage:', e);
            return [];
        }
    }

    saveToMainSite(profiles) {
        const bridge = document.getElementById('storageBridge');

        try {
            bridge.contentWindow.localStorage.setItem('profiles', JSON.stringify(profiles));
            return true;
        } catch (e) {
            console.error('❌ Cannot save to main site:', e);
            return false;
        }
    }
}

// Create global instance
window.dataBridge = new DataBridge();

// Helper functions
window.getProfiles = () => window.dataBridge.getProfiles();
window.saveProfiles = (profiles) => window.dataBridge.saveProfiles(profiles);

console.log('✅ Data Bridge loaded');
