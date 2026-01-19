// Auto-Login System - Persistent Sessions
// Keeps users logged in across browser restarts

console.log('🔐 Auto-login system starting...');

class AutoLogin {
    constructor() {
        this.SESSION_KEY = 'userSession';
        this.REMEMBER_KEY = 'rememberMe';
    }

    // Save login session to localStorage AND Firestore
    async saveSession(profile, rememberMe = true) {
        console.log('💾 Saving login session for:', profile.username);

        // Create session
        const session = {
            profileId: profile.id,
            username: profile.username,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe,
            deviceId: localStorage.getItem('deviceId')
        };

        // Save to localStorage
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        localStorage.setItem('currentUser', JSON.stringify(profile));

        // Save to Firestore for persistence
        if (window.firebaseDB && rememberMe) {
            try {
                await window.firebaseDB.collection('sessions').doc(profile.id).set({
                    ...session,
                    lastActive: new Date().toISOString()
                });
                console.log('✅ Session saved to cloud');
            } catch (error) {
                console.error('❌ Failed to save session to cloud:', error);
            }
        }
    }

    // Check for existing session on page load
    async checkForExistingSession() {
        console.log('🔍 Checking for existing session...');

        // Check localStorage first
        const localSession = localStorage.getItem(this.SESSION_KEY);
        const currentUser = localStorage.getItem('currentUser');

        if (localSession && currentUser) {
            const session = JSON.parse(localSession);
            console.log('✅ Found local session for:', session.username);
            return JSON.parse(currentUser);
        }

        // If no local session, check Firestore
        if (window.firebaseDB) {
            try {
                console.log('📥 Checking cloud for sessions...');

                const deviceId = localStorage.getItem('deviceId');
                if (!deviceId) {
                    console.log('ℹ️ No device ID, skipping cloud session check');
                    return null;
                }

                // Load profiles from cloud first
                if (window.hybridSync) {
                    await window.hybridSync.loadFromCloud();
                }

                // Check for sessions
                const sessionsRef = window.firebaseDB.collection('sessions')
                    .where('deviceId', '==', deviceId)
                    .where('rememberMe', '==', true)
                    .orderBy('lastActive', 'desc')
                    .limit(1);

                const snapshot = await sessionsRef.get();

                if (!snapshot.empty) {
                    const sessionData = snapshot.docs[0].data();
                    console.log('✅ Found cloud session for:', sessionData.username);

                    // Find profile
                    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
                    const profile = profiles.find(p => p.id === sessionData.profileId);

                    if (profile) {
                        // Restore session
                        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
                        localStorage.setItem('currentUser', JSON.stringify(profile));

                        console.log('✅ Session restored from cloud');
                        return profile;
                    }
                }

                console.log('ℹ️ No cloud session found');

            } catch (error) {
                console.error('❌ Error checking cloud session:', error);
            }
        }

        return null;
    }

    // Clear session (logout)
    async clearSession() {
        console.log('🚪 Clearing session (logout)');

        const session = localStorage.getItem(this.SESSION_KEY);

        // Remove from localStorage
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('currentUser');

        // Remove from Firestore
        if (session && window.firebaseDB) {
            try {
                const sessionData = JSON.parse(session);
                await window.firebaseDB.collection('sessions').doc(sessionData.profileId).delete();
                console.log('✅ Cloud session cleared');
            } catch (error) {
                console.error('❌ Error clearing cloud session:', error);
            }
        }
    }

    // Update last active time
    async updateLastActive() {
        const session = localStorage.getItem(this.SESSION_KEY);

        if (session && window.firebaseDB) {
            try {
                const sessionData = JSON.parse(session);
                if (sessionData.rememberMe) {
                    await window.firebaseDB.collection('sessions').doc(sessionData.profileId).update({
                        lastActive: new Date().toISOString()
                    });
                }
            } catch (error) {
                // Silently fail - not critical
            }
        }
    }

    // Auto-login if session exists
    async autoLoginIfPossible() {
        const user = await this.checkForExistingSession();

        if (user) {
            console.log('✅ Auto-login successful for:', user.username);

            // Update last active
            this.updateLastActive();

            return true;
        }

        console.log('ℹ️ No auto-login available');
        return false;
    }
}

// Create global instance
window.autoLogin = new AutoLogin();

// Export for use
console.log('✅ Auto-login system loaded');
