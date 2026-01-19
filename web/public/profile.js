// Device-based Profile System - NO Firebase Auth!
console.log('📱 Profile System Starting...');

// Generate unique device ID if not exists
function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'DEVICE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
        console.log('✅ New device ID created:', deviceId);
    }
    return deviceId;
}

// Initialize device
const DEVICE_ID = getDeviceId();

// Create profile form handler
document.getElementById('createProfileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Generate profile data
    const profileData = {
        id: 'PROFILE_' + Date.now(),
        username: username,
        password: password,
        deviceId: getDeviceId(),
        createdAt: new Date().toISOString()
    };

    try {
        console.log('Creating profile via API...');

        // Create profile via API
        await window.api.createProfile(profileData);

        // Login automatically
        const loginResult = await window.api.login(username, password);

        console.log('✅ Profile created and logged in');
        showSuccess('Profile created successfully!');

        // Redirect
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);

    } catch (error) {
        console.error('❌ Error:', error);
        showError(error.message || 'Failed to create profile');
    }
});

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
}

function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successMessage').style.display = 'block';
}

console.log('✅ Profile system loaded - Device ID:', DEVICE_ID);
