// Admin Live Chat JavaScript

let activeChats = [];
let selectedUserId = null;
let selectedUsername = null;
let messages = [];
let pollInterval = null;

// Load all active chats
async function loadActiveChats() {
    try {
        console.log('🔄 Loading active chats...');
        const response = await fetch(`${API_BASE || 'window.location.origin'}/api/chat/active-chats');
        activeChats = await response.json();
        console.log('📥 Received chats:', activeChats);
        renderChatList();
    } catch (error) {
        console.error('❌ Error loading chats:', error);
    }
}

// Refresh chats with animation
async function refreshChats() {
    const btn = document.getElementById('refreshBtn');
    btn.classList.add('refreshing');
    btn.disabled = true;

    await loadActiveChats();

    // If a chat is selected, reload its messages
    if (selectedUserId) {
        await loadMessages(selectedUserId);
    }

    setTimeout(() => {
        btn.classList.remove('refreshing');
        btn.disabled = false;
    }, 1000);
}

// Auto-refresh every 5 seconds
let autoRefreshInterval = setInterval(async () => {
    await loadActiveChats();
    if (selectedUserId) {
        await loadMessages(selectedUserId);
    }
}, 5000);

// Render chat user list
function renderChatList() {
    const container = document.getElementById('chatUsersList');

    if (activeChats.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 2rem;">
                <p>No conversations yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = activeChats.map(chat => `
        <div class="chat-user-item ${chat.userId === selectedUserId ? 'active' : ''}" 
             onclick="selectChat('${chat.userId}', '${chat.username}')">
            <div class="chat-user-header">
                <span class="chat-user-name">${chat.username}</span>
                ${chat.unreadCount > 0 ? `<span class="chat-unread-badge">${chat.unreadCount}</span>` : ''}
            </div>
            <div class="chat-last-message">
                ${chat.messageCount} message${chat.messageCount !== 1 ? 's' : ''}
            </div>
        </div>
    `).join('');
}

// Select a chat
async function selectChat(userId, username) {
    selectedUserId = userId;
    selectedUsername = username;

    // Mark as read
    await fetch(`${API_BASE || 'window.location.origin'}/api/chat/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });

    // Load messages
    await loadMessages();

    // Start polling
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(loadMessages, 3000);

    // Update UI
    renderChatList();
}

// Load messages for selected user
async function loadMessages() {
    if (!selectedUserId) return;

    try {
        const response = await fetch(`${API_BASE || 'window.location.origin'}/api/chat/${selectedUserId}`);
        messages = await response.json();
        renderChatWindow();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Render chat window
function renderChatWindow() {
    const container = document.getElementById('chatWindowContent');

    if (!selectedUserId) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
                </svg>
                <h3>Select a conversation</h3>
                <p>Choose a user from the list to start chatting</p>
            </div>
        `;
        return;
    }

    // SAVE current input value before re-rendering
    const existingInput = document.getElementById('adminMessageInput');
    const savedValue = existingInput ? existingInput.value : '';
    const wasFocused = existingInput && existingInput === document.activeElement;

    container.innerHTML = `
        <div class="chat-window-header">
            <h3>💬 Chat with ${escapeHtml(selectedUsername)}</h3>
        </div>
        <div class="chat-messages-area" id="messagesArea">
            ${messages.map(msg => `
                <div class="message-item message-${msg.sender}">
                    <div class="message-bubble">
                        <p class="message-text">${escapeHtml(msg.message)}</p>
                        <span class="message-time">${formatTime(msg.createdAt)}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="chat-input-area">
            <div class="chat-input-box">
                <input type="text" id="adminMessageInput" placeholder="Type your reply..." value="${escapeHtml(savedValue)}" onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>
    `;

    // Scroll to bottom
    setTimeout(() => {
        const messagesArea = document.getElementById('messagesArea');
        if (messagesArea) messagesArea.scrollTop = messagesArea.scrollHeight;

        // RESTORE focus if user was typing
        if (wasFocused) {
            const newInput = document.getElementById('adminMessageInput');
            if (newInput) {
                newInput.focus();
                newInput.setSelectionRange(savedValue.length, savedValue.length);
            }
        }
    }, 100);
}

// Send message
async function sendMessage() {
    const input = document.getElementById('adminMessageInput');
    const message = input?.value.trim();

    if (!message || !selectedUserId) return;

    try {
        await fetch(`${API_BASE || 'window.location.origin'}/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: selectedUserId,
                username: selectedUsername,
                message: message,
                sender: 'admin'
            })
        });

        input.value = '';
        await loadMessages();
    } catch (error) {
        console.error('Error sending message:', error);
        window.modal.error('Failed to send message. Please try again.', 'Error');
    }
}

// Handle enter key
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Initialize
loadActiveChats();
setInterval(loadActiveChats, 10000); // Refresh chat list every 10 seconds
