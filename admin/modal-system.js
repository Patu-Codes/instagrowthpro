// Dynamic API Base
const API_BASE = window.location.origin;

// Professional Modal System - Replaces all alert() and confirm()
// Beautiful, animated modals that match your design

class ModalSystem {
    constructor() {
        this.createModalContainer();
    }

    createModalContainer() {
        // Create modal container if it doesn't exist
        if (document.getElementById('modal-system')) return;

        const modalHTML = `
            <div id="modal-system" class="modal-overlay" style="display: none;">
                <div class="modal-box">
                    <div class="modal-header">
                        <span class="modal-icon"></span>
                        <h3 class="modal-title"></h3>
                    </div>
                    <div class="modal-message"></div>
                    <div class="modal-actions"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('modal-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-system-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .modal-overlay.show {
                opacity: 1;
            }

            .modal-box {
                background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 16px;
                padding: 2rem;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.9) translateY(20px);
                transition: transform 0.3s ease;
            }

            .modal-overlay.show .modal-box {
                transform: scale(1) translateY(0);
            }

            .modal-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .modal-icon {
                font-size: 3rem;
                display: block;
                margin-bottom: 1rem;
            }

            .modal-title {
                font-size: 1.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
            }

            .modal-message {
                color: rgba(255, 255, 255, 0.8);
                font-size: 1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                text-align: center;
            }

            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }

            .modal-btn {
                padding: 0.875rem 2rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .modal-btn-primary {
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                color: white;
            }

            .modal-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
            }

            .modal-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .modal-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        `;
        document.head.appendChild(style);
    }

    show(options) {
        const {
            type = 'info', // 'success', 'error', 'warning', 'confirm'
            title,
            message,
            confirmText = 'OK',
            cancelText = 'Cancel',
            onConfirm,
            onCancel
        } = options;

        const overlay = document.getElementById('modal-system');
        const iconEl = overlay.querySelector('.modal-icon');
        const titleEl = overlay.querySelector('.modal-title');
        const messageEl = overlay.querySelector('.modal-message');
        const actionsEl = overlay.querySelector('.modal-actions');

        // Set icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            confirm: '❓'
        };
        iconEl.textContent = icons[type] || icons.info;

        // Set content
        titleEl.textContent = title;
        messageEl.textContent = message;

        // Set buttons
        if (type === 'confirm') {
            actionsEl.innerHTML = `
                <button class="modal-btn modal-btn-secondary" data-action="cancel">${cancelText}</button>
                <button class="modal-btn modal-btn-primary" data-action="confirm">${confirmText}</button>
            `;
        } else {
            actionsEl.innerHTML = `
                <button class="modal-btn modal-btn-primary" data-action="confirm">${confirmText}</button>
            `;
        }

        // Show modal
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);

        // Handle button clicks
        return new Promise((resolve) => {
            const handleClick = (e) => {
                if (e.target.matches('[data-action]')) {
                    const action = e.target.dataset.action;
                    this.hide();

                    if (action === 'confirm') {
                        if (onConfirm) onConfirm();
                        resolve(true);
                    } else {
                        if (onCancel) onCancel();
                        resolve(false);
                    }

                    actionsEl.removeEventListener('click', handleClick);
                }
            };

            actionsEl.addEventListener('click', handleClick);
        });
    }

    hide() {
        const overlay = document.getElementById('modal-system');
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    // Convenience methods
    success(message, title = 'Success!') {
        return this.show({ type: 'success', title, message });
    }

    error(message, title = 'Error') {
        return this.show({ type: 'error', title, message });
    }

    warning(message, title = 'Warning') {
        return this.show({ type: 'warning', title, message });
    }

    info(message, title = 'Info') {
        return this.show({ type: 'info', title, message });
    }

    confirm(message, title = 'Confirm') {
        return this.show({
            type: 'confirm',
            title,
            message,
            confirmText: 'Yes',
            cancelText: 'No'
        });
    }
}

// Create global instance
window.modal = new ModalSystem();

// Override native alert and confirm
window.alert = (message) => window.modal.info(message);
window.confirm = (message) => window.modal.confirm(message);

console.log('✅ Professional Modal System loaded');
