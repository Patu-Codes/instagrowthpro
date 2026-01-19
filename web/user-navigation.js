// User Navigation - Shows Login/Register or Profile based on session
console.log('👤 User navigation loading...');

let hasRun = false; // Prevent multiple executions

function updateUserNavigation() {
    if (hasRun) {
        console.log('⚠️ Navigation already updated, SKIPPING to prevent duplicate');
        return;
    }

    const navContainer = document.getElementById('userNavigation');

    if (!navContainer) {
        console.log('⚠️ userNavigation element not found');
        return;
    }

    // Check if user is logged in
    const currentUserData = localStorage.getItem('currentUser');

    if (currentUserData) {
        try {
            const user = JSON.parse(currentUserData);
            console.log('✅ User is logged in:', user.username);

            // Clear any existing content first to prevent duplicates
            navContainer.innerHTML = '';

            // Create profile link - SINGLE username display
            const profileLink = document.createElement('a');
            profileLink.href = 'profile.html';
            profileLink.className = 'nav-link';
            profileLink.style.cssText = 'font-weight: 600; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;';
            // CHANGED: Using textContent instead of adding icon and text separately
            profileLink.textContent = '👤 ' + user.username;

            const logoutBtn = document.createElement('button');
            logoutBtn.onclick = logout;
            logoutBtn.className = 'btn btn-secondary';
            logoutBtn.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.9rem; margin-left: 0.5rem;';
            logoutBtn.textContent = 'Logout';

            navContainer.appendChild(profileLink);
            navContainer.appendChild(logoutBtn);

            hasRun = true; // Mark as executed
            console.log('✅ Navigation updated - Username:', user.username);
            console.log('✅ Total elements added:', navContainer.children.length);
        } catch (error) {
            console.error('❌ Error parsing user data:', error);
            showLoginButtons();
        }
    } else {
        console.log('ℹ️ No user logged in, showing login/register buttons');
        showLoginButtons();
    }
}

function showLoginButtons() {
    const navContainer = document.getElementById('userNavigation');
    if (navContainer) {
        navContainer.innerHTML = '';

        const loginBtn = document.createElement('a');
        loginBtn.href = 'login.html';
        loginBtn.className = 'btn btn-secondary';
        loginBtn.style.marginRight = '0.5rem';
        loginBtn.textContent = 'Login';

        const signupBtn = document.createElement('a');
        signupBtn.href = 'register.html';
        signupBtn.className = 'btn btn-primary';
        signupBtn.textContent = 'Sign Up';

        navContainer.appendChild(loginBtn);
        navContainer.appendChild(signupBtn);

        hasRun = true;
    }
}

function logout() {
    console.log('👋 Logging out...');

    // Clear localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');

    // Redirect to homepage
    window.location.href = 'index.html';
}

// Run ONLY ONCE on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, updating navigation...');
        updateUserNavigation();
    });
} else {
    console.log('✅ DOM already loaded, updating navigation now...');
    updateUserNavigation();
}

// Make functions global
window.logout = logout;
window.updateUserNavigation = updateUserNavigation;

console.log('✅ User navigation system ready');
