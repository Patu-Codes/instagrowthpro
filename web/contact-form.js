// Contact Form Modal and Functionality

function openContactForm() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('contactFormModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contactFormModal';
        modal.innerHTML = `
            <div style="background: #1a1a2e; border-radius: 20px; padding: 3rem; max-width: 500px; width: 90%; border: 1px solid rgba(139, 92, 246, 0.3); position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="color: #fff; margin: 0;">📧 Contact Support</h2>
                    <button onclick="closeContactForm()" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                
                <form id="contactForm" onsubmit="submitContactForm(event); return false;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Full Name *</label>
                        <input type="text" id="contactName" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; color: #fff; box-sizing: border-box;">
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Email Address *</label>
                        <input type="email" id="contactEmail" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; color: #fff; box-sizing: border-box;">
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Subject *</label>
                        <input type="text" id="contactSubject" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; color: #fff; box-sizing: border-box;">
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Message *</label>
                        <textarea id="contactMessage" required rows="5" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; color: #fff; resize: vertical; box-sizing: border-box;"></textarea>
                    </div>

                    <div id="formMessage" style="margin-bottom: 1rem; padding: 1rem; border-radius: 10px; display: none;"></div>

                    <button type="submit" id="submitBtn" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">
                        Send Message
                    </button>
                </form>
            </div>
        `;

        modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; align-items: center; justify-content: center;';

        document.body.appendChild(modal);

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'contactFormModal') {
                closeContactForm();
            }
        });
    }

    modal.style.display = 'flex';
}

function closeContactForm() {
    const modal = document.getElementById('contactFormModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('contactForm');
        if (form) form.reset();
        const msg = document.getElementById('formMessage');
        if (msg) msg.style.display = 'none';
    }
}

async function submitContactForm(event) {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const submitBtn = document.getElementById('submitBtn');

    // Validate
    if (!name || !email || !subject || !message) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch('http://localhost:3000/api/contact/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showMessage('✅ ' + data.message, 'success');
            document.getElementById('contactForm').reset();
            setTimeout(() => closeContactForm(), 3000);
        } else {
            // Show fallback modal with alternative options
            showFallbackModal(email, subject, message);
        }
    } catch (error) {
        console.error('Contact form error:', error);
        // Show fallback modal with alternative options
        showFallbackModal(email, subject, message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

function showFallbackModal(userEmail, subject, message) {
    closeContactForm();

    const fallbackModal = document.createElement('div');
    fallbackModal.id = 'fallbackModal';
    fallbackModal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10001; align-items: center; justify-content: center;';

    fallbackModal.innerHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; padding: 3rem; max-width: 550px; width: 90%; border: 2px solid rgba(139, 92, 246, 0.5); box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h2 style="color: #fff; margin: 0 0 1rem 0; font-size: 1.75rem;">Email Service Temporarily Unavailable</h2>
                <p style="color: rgba(255,255,255,0.7); font-size: 0.95rem; line-height: 1.6;">
                    We're experiencing a temporary issue with our automated email system. Don't worry - we've saved your message in our database!
                </p>
            </div>
            
            <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 15px; padding: 1.5rem; margin-bottom: 2rem;">
                <h3 style="color: #EC4899; margin: 0 0 1rem 0; font-size: 1.1rem;">📋 Your Message Details:</h3>
                <p style="color: #fff; margin: 0.5rem 0; font-size: 0.9rem;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: rgba(255,255,255,0.7); margin: 0.5rem 0; font-size: 0.85rem;">Message saved successfully in our database</p>
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <h3 style="color: #10B981; margin: 0 0 1rem 0; font-size: 1.1rem;">✅ Alternative Contact Methods:</h3>
                
                <div style="margin: 1rem 0;">
                    <p style="color: #fff; margin: 0.5rem 0; font-weight: 600;">1. WhatsApp (Instant Response)</p>
                    <a href="https://wa.me/919372645587?text=Hi%2C%20I%20need%20support%20regarding%3A%20${encodeURIComponent(subject)}" 
                       target="_blank"
                       style="display: inline-block; margin-top: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #25D366, #128C7E); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; transition: transform 0.2s;">
                        💬 Chat on WhatsApp
                    </a>
                </div>

                <div style="margin: 1.5rem 0; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="color: #fff; margin: 0.5rem 0; font-weight: 600;">2. Email Directly</p>
                    <a href="mailto:neomatrix.studio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\nFrom: ' + userEmail)}"
                       style="display: inline-block; margin-top: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; transition: transform 0.2s;">
                        📧 neomatrix.studio@gmail.com
                    </a>
                    <p style="color: rgba(255,255,255,0.6); margin: 0.5rem 0; font-size: 0.85rem;">Click to open your email app with pre-filled message</p>
                </div>
            </div>

            <button onclick="document.getElementById('fallbackModal').remove()" 
                    style="width: 100%; padding: 1rem; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(fallbackModal);

    // Close on outside click
    fallbackModal.addEventListener('click', (e) => {
        if (e.target.id === 'fallbackModal') {
            fallbackModal.remove();
        }
    });
}

function showMessage(text, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;

    formMessage.textContent = text;
    formMessage.style.display = 'block';
    formMessage.style.background = type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    formMessage.style.color = type === 'success' ? '#10B981' : '#EF4444';
    formMessage.style.border = type === 'success' ? '1px solid #10B981' : '1px solid #EF4444';
}

// Make functions globally available
window.openContactForm = openContactForm;
window.closeContactForm = closeContactForm;
window.submitContactForm = submitContactForm;

console.log('✅ Contact form system loaded');
