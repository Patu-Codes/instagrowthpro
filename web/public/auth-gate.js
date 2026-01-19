// Professional Auth Gate - Blocks ordering without login
// Replaces browser alerts with beautiful modals

class AuthGate {
    constructor() {
        this.modalOpen = false;
    }

    // Show professional login required modal
    showLoginRequiredModal() {
        if (this.modalOpen) return;
        this.modalOpen = true;

        const modalHTML = `
            <div id="authGateModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 99999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s;">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid rgba(139, 92, 246, 0.5); border-radius: 20px; max-width: 500px; width: 90%; padding: 0; overflow: hidden; box-shadow: 0 25px 60px rgba(139, 92, 246, 0.4); animation: slideUp 0.4s;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 2rem; text-align: center;">
                        <h2 style="margin: 0; font-size: 1.75rem; font-weight: 800; color: white;">Login Required</h2>
                    </div>

                    <!-- Content -->
                    <div style="padding: 2rem;">
                        <p style="color: #a0a0b0; font-size: 1.125rem; line-height: 1.6; text-align: center; margin: 0 0 2rem 0;">
                            You need to <strong style="color: white;">create a profile</strong> or <strong style="color: white;">login</strong> before placing an order.
                        </p>

                        <!-- Benefits -->
                        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
                            <div style="font-size: 0.875rem; font-weight: 700; color: #8B5CF6; margin-bottom: 1rem;">WHY CREATE A PROFILE?</div>
                            <div style="display: grid; gap: 0.75rem;">
                                <div style="display: flex; align-items: start; gap: 0.75rem;">
                                    <span style="color: #10B981; font-size: 1.25rem;">✓</span>
                                    <span style="color: #c0c0c0; font-size: 0.9375rem;">Track all your orders in one place</span>
                                </div>
                                <div style="display: flex; align-items: start; gap: 0.75rem;">
                                    <span style="color: #10B981; font-size: 1.25rem;">✓</span>
                                    <span style="color: #c0c0c0; font-size: 0.9375rem;">Faster checkout next time</span>
                                </div>
                                <div style="display: flex; align-items: start; gap: 0.75rem;">
                                    <span style="color: #10B981; font-size: 1.25rem;">✓</span>
                                    <span style="color: #c0c0c0; font-size: 0.9375rem;">Access order history & support</span>
                                </div>
                                <div style="display: flex; align-items: start; gap: 0.75rem;">
                                    <span style="color: #10B981; font-size: 1.25rem;">✓</span>
                                    <span style="color: #c0c0c0; font-size: 0.9375rem;">Stay logged in - no need to login again!</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="display: grid; gap: 0.75rem;">
                            <button onclick="authGate.goToRegister()" style="width: 100%; padding: 1rem 2rem; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); border: none; border-radius: 12px; color: white; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
                                <span style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                    <span>🚀</span>
                                    <span>Create Profile Now</span>
                                </span>
                            </button>
                            
                            <button onclick="authGate.goToLogin()" style="width: 100%; padding: 1rem 2rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; color: white; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s;">
                                <span style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                    <span>Already have a profile? Login</span>
                                </span>
                            </button>
                            
                            <button onclick="authGate.closeModal()" style="width: 100%; padding: 0.875rem; background: transparent; border: none; color: #808080; font-weight: 500; font-size: 0.875rem; cursor: pointer;">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            #authGateModal button:hover {
                transform: translateY(-2px);
                filter: brightness(1.1);
            }
        `;
        document.head.appendChild(style);

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('authGateModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.2s';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
                this.modalOpen = false;
            }, 200);
        }
    }

    // Go to register page
    goToRegister() {
        window.location.href = 'register.html';
    }

    // Go to login page
    goToLogin() {
        window.location.href = 'login.html';
    }

    // Check if user is logged in
    isUserLoggedIn() {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser !== null;
    }

    // Gate check - returns true if user can proceed, false if blocked
    checkAuthAndProceed(callback) {
        if (this.isUserLoggedIn()) {
            // User is logged in, proceed
            if (callback) callback();
            return true;
        } else {
            // User not logged in, show modal
            this.showLoginRequiredModal();
            return false;
        }
    }

    // Block form submission if not logged in
    protectForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!this.isUserLoggedIn()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showLoginRequiredModal();
                    return false;
                }
            }, true);
        }
    }
}

// Create global instance
window.authGate = new AuthGate();

// Auto-protect order form on load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on order page
    if (window.location.pathname.includes('order.html')) {
        window.authGate.protectForm('orderForm');

        // Also check on page load
        setTimeout(() => {
            if (!window.authGate.isUserLoggedIn()) {
                window.authGate.showLoginRequiredModal();
            }
        }, 500);
    }
});

console.log('✅ Professional Auth Gate loaded');
