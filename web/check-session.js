// Auto-check for existing session on page load
// Add this to pages that need authentication

(async function () {
    console.log('🔐 Checking for existing login session...');

    // Wait for auto-login system to load
    await new Promise(resolve => {
        if (window.autoLogin) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (window.autoLogin) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 5000);
        }
    });

    // Check for existing session
    if (window.autoLogin) {
        const isLoggedIn = await window.autoLogin.autoLoginIfPossible();

        if (isLoggedIn) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            console.log('✅ Auto-logged in as:', currentUser.username);

            // Show welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
                z-index: 10000;
                font-family: Inter, sans-serif;
                animation: slideIn 0.3s ease-out;
            `;
            welcomeMsg.innerHTML = `
                <div style="font-weight: 600;">Welcome back, ${currentUser.username}! 👋</div>
                <div style="font-size: 0.875rem; margin-top: 5px; opacity: 0.9;">You're already logged in</div>
            `;

            document.body.appendChild(welcomeMsg);

            // Remove after 3 seconds
            setTimeout(() => {
                welcomeMsg.style.transition = 'opacity 0.3s';
                welcomeMsg.style.opacity = '0';
                setTimeout(() => welcomeMsg.remove(), 300);
            }, 3000);
        } else {
            console.log('ℹ️ No existing session - user needs to login');
        }
    }
})();

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
