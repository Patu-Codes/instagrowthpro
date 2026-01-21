// Live Chat Widget for Users
// Auto-loads on all pages

// Production API Base
const API_BASE = 'https://instagrowthpro-backend.onrender.com';

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.userId = null;
        this.username = null;
        this.messages = [];
        this.init();
    }

    init() {
        // Get current user
        const user = window.api?.getCurrentUser();
        if (user) {
            this.userId = user.id;
            this.username = user.username;
            console.log('✅ Chat widget initialized for user:', this.username);
        } else {
            console.log('⚠️ No user logged in - chat disabled');
        }

        // Create chat button
        this.createChatButton();

        // Create chat window
        this.createChatWindow();

        // Load messages if logged in
        if (this.userId) {
            this.loadMessages();
            // Poll for new messages every 5 seconds
            setInterval(() => this.loadMessages(), 5000);
        }
    }

    createChatButton() {
        const button = document.createElement('div');
        button.id = 'chat-widget-button';
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="white"/>
            </svg>
            <span id="chat-unread-badge" style="display: none;">0</span>
        `;
        button.onclick = () => this.toggleChat();
        document.body.appendChild(button);
    }

    createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chat-widget-window';
        chatWindow.style.display = 'none';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div>
                    <h3 style="margin: 0; font-size: 1.1rem;">💬 Live Support</h3>
                    <p style="margin: 0; font-size: 0.85rem; opacity: 0.8;">
                        ${this.userId ? 'We reply instantly!' : 'Login to chat'}
                    </p>
                </div>
                <button id="chat-close-btn">✕</button>
            </div>
            <div id="chat-messages"></div>
            <div class="chat-input-area">
                ${this.userId ? `
                    <input type="text" id="chat-message-input" placeholder="Type your message..." />
                    <button id="chat-send-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2 10l16-8-8 16-2-8-6-0z" fill="white"/>
                        </svg>
                    </button>
                ` : `
                    <a href="login.html" style="text-align: center; padding: 1rem; color: white; text-decoration: none; display: block;">
                        Login to start chatting →
                    </a>
                `}
            </div>
        `;
        document.body.appendChild(chatWindow);

        // Event listeners
        document.getElementById('chat-close-btn').onclick = () => this.toggleChat();

        if (this.userId) {
            document.getElementById('chat-send-btn').onclick = () => this.sendMessage();
            document.getElementById('chat-message-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-widget-window');
        chatWindow.style.display = this.isOpen ? 'flex' : 'none';

        if (this.isOpen && this.userId) {
            this.loadMessages();
            // Clear unread badge
            const badge = document.getElementById('chat-unread-badge');
            badge.style.display = 'none';
        }
    }

    async loadMessages() {
        if (!this.userId) return;

        try {
            const response = await fetch(`${API_BASE}/api/chat/${this.userId}`);
            const messages = await response.json();

            // Check for new unread messages
            const newMessages = messages.filter(m =>
                m.sender === 'admin' &&
                !this.messages.find(old => old.id === m.id)
            );

            if (newMessages.length > 0 && !this.isOpen) {
                const badge = document.getElementById('chat-unread-badge');
                badge.textContent = newMessages.length;
                badge.style.display = 'flex';
            }

            this.messages = messages;
            this.renderMessages();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    renderMessages() {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        container.innerHTML = this.messages.map(msg => `
            <div class="chat-message ${msg.sender === 'user' ? 'user-message' : 'admin-message'}">
                <div class="message-bubble">
                    <p>${this.escapeHtml(msg.message)}</p>
                    <span class="message-time">${this.formatTime(msg.createdAt)}</span>
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    async sendMessage() {
        const input = document.getElementById('chat-message-input');
        const message = input.value.trim();

        if (!message) return;

        console.log('📤 Sending message:', message);
        console.log('👤 User:', this.username, 'ID:', this.userId);

        try {
            const response = await fetch(`${API_BASE}/api/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    username: this.username,
                    message: message,
                    sender: 'user'
                })
            });

            console.log('📨 Response:', response.status, response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Message sent successfully:', data);
                input.value = '';
                await this.loadMessages();
            } else {
                console.error('❌ Failed to send message');
            }
        } catch (error) {
            console.error('❌ Error sending message:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

// Initialize chat widget when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
});
