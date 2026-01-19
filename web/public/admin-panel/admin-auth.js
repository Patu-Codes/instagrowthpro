// Admin Authentication
const ADMIN_CREDENTIALS = {
    email: 'prathamesh0045k@gmail.com',
    password: 'Patu_2005'
};

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Set admin session
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        showError('Invalid email or password');
    }
});

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = '⚠️ ' + message;
    errorEl.style.display = 'block';
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 3000);
}

console.log('✅ Admin auth loaded');
