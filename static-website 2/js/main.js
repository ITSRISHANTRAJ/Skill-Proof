// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Add simple role toggle for registration form
    const roleBtns = document.querySelectorAll('.role-btn');
    if (roleBtns.length > 0) {
        roleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                roleBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById('selected-role').value = e.target.dataset.role;
            });
        });
    }

    // Mock form submission logic for demo
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Authenticating...';
            btn.style.opacity = '0.8';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Creating account...';
            btn.style.opacity = '0.8';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        });
    }
});
