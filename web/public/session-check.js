// Auto-Login System - Checks if user is logged in on page load
// Runs on every page to maintain session

console.log('🔐 Session check starting...');

// Check if user is logged in
const checkSession = () => {
    const currentUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');

    if (currentUser && authToken) {
        try {
            const user = JSON.parse(currentUser);
            console.log('✅ Session found:', user.username);

            // Update navigation to show user is logged in
            updateNavigation(user);

            return user;
        } catch (error) {
            console.error('❌ Invalid session data:', error);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
        }
    } else {
        console.log('ℹ️ No active session');
    }

    return null;
};

// Update navigation based on login status
// DISABLED: Navigation is now handled by user-navigation.js
const updateNavigation = (user) => {
    // Navigation update is handled by user-navigation.js
    // This function is kept for compatibility but does nothing
    console.log('ℹ️ Navigation update skipped - handled by user-navigation.js');

    /* ORIGINAL CODE - DISABLED
    // Find login/register links and replace with profile link
    const navLinks = document.querySelector('.nav-links');

    if (navLinks) {
        // Check if already updated
        if (!navLinks.querySelector('.nav-user')) {
            // Remove login/register links if they exist
            const existingAuthLinks = navLinks.querySelectorAll('a[href="login.html"], a[href="register.html"]');
            existingAuthLinks.forEach(link => link.remove());

            // Add profile link
            const profileLink = document.createElement('a');
            profileLink.href = 'profile.html';
            profileLink.className = 'nav-link nav-user';
            profileLink.innerHTML = `
                <span style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); 
                             -webkit-background-clip: text; 
                             -webkit-text-fill-color: transparent; 
                             font-weight: 600;">
                    👤 ${user.username}
                </span>
            `;
            navLinks.appendChild(profileLink);

            console.log('✅ Navigation updated for logged in user');
        }
    }
    */
};

// Run on page load
const currentUser = checkSession();

// Make available globally
window.currentSessionUser = currentUser;

console.log('✅ Session check complete');
