// Simple Login System - Device-based
console.log('🔐 Login System Starting...');

// Get device ID
const DEVICE_ID = localStorage.getItem('deviceId') || 'DEVICE_' + Date.now();
if (!localStorage.getItem('deviceId')) {
    localStorage.setItem('deviceId', DEVICE_ID);
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Get profiles from this device
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    // Find matching profile
    const profile = profiles.find(p => p.username === username && p.password === password);

    if (!profile) {
        showError('Invalid username or password');
        return;
    }

    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify(profile));

    console.log('✅ Login successful:', username);

    // Redirect
    window.location.href = 'index.html';
});

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
}

console.log('✅ Login system loaded');
