// Instagram Username Verification with Backend
let usernameCheckTimeout;
let isUsernameValid = false;

function checkInstagramUsername() {
    const input = document.getElementById('username');
    const feedback = document.getElementById('username-feedback');
    const username = input.value.trim().replace('@', '');

    // Clear previous timeout
    clearTimeout(usernameCheckTimeout);

    // Reset validation flag
    isUsernameValid = false;

    // Hide feedback if empty
    if (!username) {
        feedback.style.display = 'none';
        input.style.borderColor = '';
        return;
    }

    // Quick format validation
    const validFormat = /^[a-zA-Z0-9._]{1,30}$/.test(username);

    if (!validFormat) {
        feedback.style.display = 'block';
        feedback.innerHTML = '<span style="color: #EF4444;">❌ Invalid username format</span>';
        input.style.borderColor = '#EF4444';
        return;
    }

    // Show checking status
    feedback.style.display = 'block';
    feedback.innerHTML = '<span style="color: #F59E0B;">⏳ Verifying Instagram profile...</span>';
    input.style.borderColor = '#F59E0B';

    // Debounce the backend call
    usernameCheckTimeout = setTimeout(async () => {
        console.log('🔍 Starting verification for:', username);

        try {
            const response = await fetch('http://localhost:3000/api/verify-instagram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('📡 Backend response:', result);

            if (result.valid && result.exists && result.isPublic) {
                // Success - Profile exists and is public
                console.log('✅ Valid public profile');
                feedback.innerHTML = '<span style="color: #10B981;">✅ Profile verified - Account is public</span>';
                input.style.borderColor = '#10B981';
                isUsernameValid = true;
            } else if (result.exists && !result.isPublic) {
                // Profile exists but is private
                console.log('🔒 Profile is private');
                feedback.innerHTML = '<span style="color: #EF4444;">🔒 Account is private. Please make it public to continue.</span>';
                input.style.borderColor = '#EF4444';
                isUsernameValid = false;
            } else if (!result.exists) {
                // Profile doesn't exist
                console.log('❌ Profile not found');
                feedback.innerHTML = '<span style="color: #EF4444;">❌ Profile not found. Please check the username.</span>';
                input.style.borderColor = '#EF4444';
                isUsernameValid = false;
            } else {
                // Other error
                console.log('⚠️ Other error:', result.error);
                feedback.innerHTML = `<span style="color: #EF4444;">❌ ${result.error || 'Verification failed'}</span>`;
                input.style.borderColor = '#EF4444';
                isUsernameValid = false;
            }

        } catch (error) {
            console.error('❌ Verification error:', error);
            feedback.innerHTML = '<span style="color: #EF4444;">❌ Could not connect to verification server. Please try again.</span>';
            input.style.borderColor = '#EF4444';
            isUsernameValid = false;
        }
    }, 1200); // Wait 1.2 seconds after user stops typing
}

// Prevent form submission if Instagram is not verified
document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        const originalSubmit = orderForm.getAttribute('onsubmit');

        orderForm.addEventListener('submit', function (e) {
            const username = document.getElementById('username').value.trim();

            if (username && !isUsernameValid) {
                e.preventDefault();
                e.stopPropagation();

                const feedback = document.getElementById('username-feedback');
                feedback.style.display = 'block';
                feedback.innerHTML = '<span style="color: #EF4444;">❌ Please verify your Instagram account first</span>';

                const input = document.getElementById('username');
                input.focus();
                input.style.borderColor = '#EF4444';

                return false;
            }
        }, true); // Use capture phase
    }
});
