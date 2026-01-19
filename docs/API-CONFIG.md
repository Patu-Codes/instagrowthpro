# 🔧 API Configuration Guide

## 📋 Quick Setup

### For Development (Localhost)
No changes needed! API automatically uses `http://localhost:3000`

### For Production Deployment

**Step 1: Update Backend URL**

Edit these files and replace `'https://your-backend-url.com'`:

1. **`web/api-config.js`** (Line 6)
2. **`admin/api-config.js`** (Line 6)

Replace with your actual backend URL:
```javascript
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://api.instagrowth.com'  // 👈 Your production backend
    : 'http://localhost:3000';
```

---

## 📁 Files Modified

### Web App (`web/`)
- ✅ Created: `web/api-config.js` (centralized config)
- ⚠️ **TODO:** Update production files to use `window.API_ENDPOINTS`

### Admin App (`admin/`)
- ✅ Created: `admin/api-config.js` (centralized config)
- ⚠️ **TODO:** Update production files to use `window.ADMIN_API_ENDPOINTS`

---

## 🚀 Deployment Steps

### 1. Update Backend URL
```javascript
// web/api-config.js (Line 6)
? 'https://your-backend.herokuapp.com'  // Your actual backend

// admin/api-config.js (Line 6)
? 'https://your-backend.herokuapp.com'  // Your actual backend
```

### 2. Include in HTML
Add to `<head>` section in all HTML files:

**For web app:**
```html
<script src="api-config.js"></script>
```

**For admin app:**
```html
<script src="api-config.js"></script>
```

### 3. Update JavaScript Files
Replace hardcoded URLs with:

**Instead of:**
```javascript
fetch('http://localhost:3000/api/orders')
```

**Use:**
```javascript
fetch(API_ENDPOINTS.orders)
```

---

## 📝 Example Usage

```javascript
// Orders
fetch(API_ENDPOINTS.orders)

// Stats
fetch(API_ENDPOINTS.stats)

// Chat
fetch(API_ENDPOINTS.chat('user123'))

// Demo usage
fetch(API_ENDPOINTS.demoUsage('profile456'))
```

---

## ⚠️ Security Note

**Never commit production URLs to Git!**

For advanced setup, use environment variables:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';
```

---

## ✅ Environment Detection

The config automatically detects:
- **localhost** → uses `http://localhost:3000`
- **any other domain** → uses production URL

---

**Last Updated:** 2026-01-19  
**Status:** Ready for production deployment
