// Simple Instagram username format validation
function validateInstagramUsername() {
    const input = document.getElementById('username');
    const feedback = document.getElementById('username-feedback');
    let username = input.value.trim();

    // Hide feedback if empty
    if (!username) {
        feedback.style.display = 'none';
        input.style.borderColor = '';
        return;
    }

    // Remove @ only if it's at the beginning
    if (username.startsWith('@')) {
        username = username.substring(1);
    }

    // Check if @ symbol exists anywhere in the username (invalid)
    if (username.includes('@')) {
        feedback.style.display = 'block';
        feedback.innerHTML = '<span style="color: #EF4444;">❌ Username is invalid (@ symbol not allowed)</span>';
        input.style.borderColor = '#EF4444';
        return;
    }

    // Instagram username format: only letters, numbers, periods, and underscores (1-30 chars)
    const validFormat = /^[a-zA-Z0-9._]{1,30}$/.test(username);

    if (!validFormat) {
        // Invalid format - show error
        feedback.style.display = 'block';
        feedback.innerHTML = '<span style="color: #EF4444;">❌ Username is invalid</span>';
        input.style.borderColor = '#EF4444';
    } else {
        // Valid format - hide feedback
        feedback.style.display = 'none';
        input.style.borderColor = '';
    }
}
