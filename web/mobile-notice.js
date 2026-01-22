// ==========================================
// MOBILE DESKTOP SUGGESTION NOTICE
// ==========================================

(function () {
    'use strict';

    const STORAGE_KEY = 'hideDesktopNotice';
    const MOBILE_MAX_WIDTH = 768;

    // Check if user is on mobile
    function isMobile() {
        return window.innerWidth <= MOBILE_MAX_WIDTH;
    }

    // Check if notice was previously dismissed
    function wasNoticeDismissed() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    // Create and show notice
    function showMobileNotice() {
        if (!isMobile() || wasNoticeDismissed()) {
            return;
        }

        const noticeHTML = `
            <div id="mobile-desktop-notice" class="show">
                <button class="notice-close" onclick="dismissNotice()">&times;</button>
                <div class="notice-content">
                    <div class="notice-icon">💻</div>
                    <div class="notice-title">Enable Desktop Mode</div>
                    <div class="notice-message">
                        For the best viewing and using experience, we recommend turning on Desktop Mode ☑️ in your browser settings.
                    </div>
                    <div class="notice-buttons">
                        <button class="notice-btn notice-btn-primary" onclick="dismissNotice()">
                            Got It
                        </button>
                        <button class="notice-btn notice-btn-secondary" onclick="dismissNoticePermanently()">
                            Don't Show Again
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert notice into body
        document.body.insertAdjacentHTML('beforeend', noticeHTML);
    }

    // Dismiss notice for this session
    window.dismissNotice = function () {
        const notice = document.getElementById('mobile-desktop-notice');
        if (notice) {
            notice.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => {
                notice.remove();
            }, 300);
        }
    };

    // Dismiss notice permanently
    window.dismissNoticePermanently = function () {
        localStorage.setItem(STORAGE_KEY, 'true');
        dismissNotice();
    };

    // Add slideDown animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Show notice after page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(showMobileNotice, 1000);
        });
    } else {
        setTimeout(showMobileNotice, 1000);
    }

    // Re-check on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isMobile()) {
                const notice = document.getElementById('mobile-desktop-notice');
                if (notice) {
                    notice.remove();
                }
            }
        }, 250);
    });
})();

console.log('✅ Mobile Desktop Notice loaded');
