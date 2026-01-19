# 🚀 LIVE CHAT SYSTEM IMPLEMENTATION GUIDE

This guide explains how to add the live chat feature to your existing backend.

## Step 1: Add to backend-server.js

Add this code BEFORE the `app.listen()` line:

```javascript
// ============ CHAT TABLE ============
db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    sender TEXT NOT NULL,
    isRead INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error('Error creating chat_messages table:', err);
    } else {
        console.log('✅ Chat messages table ready');
    }
});

// ============ CHAT ENDPOINTS ============

// Get all messages for a user
app.get('/api/chat/:userId', (req, res) => {
    const { userId } = req.params;
    
    db.all(
        `SELECT * FROM chat_messages WHERE userId = ? ORDER BY createdAt ASC`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// Send message (from user or admin)
app.post('/api/chat/send', (req, res) => {
    const { userId, username, message, sender } = req.body;
    const createdAt = new Date().toISOString();
    
    db.run(
        `INSERT INTO chat_messages (userId, username, message, sender, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, username, message, sender, createdAt],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.json({
                success: true,
                messageId: this.lastID,
                message: {
                    id: this.lastID,
                    userId,
                    username,
                    message,
                    sender,
                    createdAt
                }
            });
        }
    );
});

// Get all active chats (for admin)
app.get('/api/chat/active-chats', (req, res) => {
    const query = `
        SELECT 
            userId,
            username,
            MAX(createdAt) as lastMessageTime,
            COUNT(*) as messageCount,
            SUM(CASE WHEN isRead = 0 AND sender = 'user' THEN 1 ELSE 0 END) as unreadCount
        FROM chat_messages
        GROUP BY userId
        ORDER BY lastMessageTime DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Mark messages as read
app.post('/api/chat/mark-read', (req, res) => {
    const { userId } = req.body;
    
    db.run(
        `UPDATE chat_messages SET isRead = 1 WHERE userId = ? AND sender = 'user'`,
        [userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, updated: this.changes });
        }
    );
});
```

## Step 2: Restart Backend

After adding the code:
```bash
# Stop current backend (Ctrl+C)
node backend-server.js
```

## Step 3: Files Created

I'm creating these files:
1. **public/chat-widget.js** - User chat interface
2. **public/chat-widget.css** - Chat styling
3. **ADMIN PANEL APP/live-chat.html** - Admin chat interface  
4. **ADMIN PANEL APP/live-chat.js** - Admin chat logic

## Step 4: Add to Contact Page

The contact page will have a working "Live Chat" button that opens the chat widget!

---

**Everything will work automatically after restarting the backend!** 🚀
