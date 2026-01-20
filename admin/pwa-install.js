// PWA Installation Helper for Admin Panel
// Handles service worker registration and installation prompts

let deferredPrompt;
let isInstalled = false;

// Check if running as installed PWA
function checkIfInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://');
}

// Register service worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('[PWA] Service Worker registered:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('[PWA] New version available! Please refresh.');
                        // You can show a notification here
                    }
                });
            });

            return registration;
        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error);
        }
    } else {
        console.log('[PWA] Service Workers not supported');
    }
}

// Show install prompt
function showInstallPrompt() {
    const installBanner = document.getElementById('pwa-install-banner');
    if (installBanner && deferredPrompt && !isInstalled) {
        installBanner.style.display = 'block';
    }
}

// Handle install button click
async function handleInstallClick() {
    if (!deferredPrompt) {
        console.log('[PWA] Install prompt not available');
        return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response: ${outcome}`);

    // Clear the deferred prompt
    deferredPrompt = null;

    // Hide install banner
    const installBanner = document.getElementById('pwa-install-banner');
    if (installBanner) {
        installBanner.style.display = 'none';
    }
}

// Initialize PWA features
function initPWA() {
    isInstalled = checkIfInstalled();
    console.log('[PWA] Running as installed app:', isInstalled);

    // Register service worker
    registerServiceWorker();

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] Install prompt available');
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully!');
        isInstalled = true;
        deferredPrompt = null;
    });

    // Add install button listener if it exists
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', handleInstallClick);
    }

    // Add iOS install instructions
    if (isiOS()) {
        showIOSInstructions();
    }
}

// Check if iOS device
function isiOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Show iOS installation instructions
function showIOSInstructions() {
    if (!isInstalled && isiOS()) {
        const iosInstructions = document.getElementById('ios-install-instructions');
        if (iosInstructions) {
            iosInstructions.style.display = 'block';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
} else {
    initPWA();
}

// Export for use in other scripts
window.PWA = {
    isInstalled: () => isInstalled,
    showInstallPrompt,
    registerServiceWorker
};

console.log('[PWA Install] Module loaded');
