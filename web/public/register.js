// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJc3ZLiR9BSB01hOaSRHO3lSmLf0le8zw",
    authDomain: "instagrow-x.firebaseapp.com",
    projectId: "instagrow-x",
    storageBucket: "instagrow-x.firebasestorage.app",
    messagingSenderId: "320041630068",
    appId: "1:320041630068:web:01cde8140ceb3750ee9421",
    measurementId: "G-WMVHQCMEZS"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

console.log('✅ Firebase Auth initialized');

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Clear previous messages
    hideMessages();

    // Validate passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    // Validate username
    if (username.length < 3) {
        showError('Username must be at least 3 characters');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<span>Creating account...</span>';
    submitBtn.disabled = true;

    try {
        // Create Firebase Auth user
        await auth.createUserWithEmailAndPassword(email, password);

        console.log('✅ SUCCESS! Redirecting...');

        // Store username
        localStorage.setItem('username', username);

        // Show success
        submitBtn.innerHTML = '<span>✅ Success! Redirecting...</span>';

        // Try MULTIPLE redirect methods as fallback
        try {
            // Method 1: location.replace (no history entry)
            window.location.replace('index.html');
        } catch (e1) {
            try {
                // Method 2: location.href
                window.location.href = 'index.html';
            } catch (e2) {
                // Method 3: Direct assignment
                window.location = 'index.html';
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);

        let errorMessage = 'Registration failed';

        // Check if it's a username already exists error
        if (error.message && error.message.includes('username')) {
            errorMessage = 'Try different username, this one exists';
        } else if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email already registered - Please login instead';
            // Show login button
            submitBtn.innerHTML = '<a href="login.html" style="color: white; text-decoration: none;">Go to Login</a>';
            submitBtn.disabled = false;
            return;
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password must be at least 6 characters';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
        } else {
            errorMessage = error.message;
        }

        showError(errorMessage);
        submitBtn.innerHTML = '<span>Create Account</span>';
        submitBtn.disabled = false;
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

function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

console.log('✅ LOADED - TRIPLE REDIRECT FALLBACK VERSION');
