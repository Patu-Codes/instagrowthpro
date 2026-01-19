// Login Handler - Uses API instead of localStorage

console.log('🔐 Login system loading...');

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    try {
        console.log('Logging in via API...');

        // Login via API
        const result = await window.api.login(username, password);

        console.log('✅ Login successful');
        showSuccess('Login successful!');

        // Redirect
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);

    } catch (error) {
        console.error('❌ Login error:', error);
        showError(error.message || 'Invalid username or password');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

console.log('✅ Login system ready');
