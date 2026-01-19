# 🌐 Backend URL Guide - Where to Host & What URL to Use

## ❓ The Question: "Which URLs?"

You need to understand **WHERE your backend will be hosted** in production.

---

## 🏗️ **Your Architecture:**

```
┌─────────────────────┐
│   FRONTEND (Web)    │ → Vercel hosting
│   instagrowth.com   │    ✅ FREE
└──────────┬──────────┘
           │
           │ API calls
           │
           ▼
┌─────────────────────┐
│   BACKEND (API)     │ → ❓ WHERE?
│   SQLite + Express  │
│   PM2 + Node.js     │
└─────────────────────┘
```

**The problem:** Vercel is for FRONTEND only. Your backend needs a different host.

---

## 🎯 **Backend Hosting Options:**

### **Option 1: Railway.app** (Recommended - EASIEST)
✅ **FREE tier available**  
✅ **Supports SQLite**  
✅ **Supports PM2/Node.js**  
✅ **Automatic HTTPS**  

**Your backend URL will be:**
```
https://instagrowth-backend-production.up.railway.app
```

**Steps:**
1. Go to https://railway.app
2. Connect GitHub repo
3. Deploy `backend/` folder
4. Copy the Railway URL

---

### **Option 2: Render.com** (Also Good)
✅ **FREE tier**  
✅ **Supports Node.js**  
⚠️ **SQLite resets on redeploy** (use PostgreSQL instead)

**Your backend URL will be:**
```
https://instagrowth-backend.onrender.com
```

---

### **Option 3: Heroku** (Popular but Paid)
❌ **No free tier anymore**  
✅ **Reliable**  
✅ **Good for production**

**Your backend URL will be:**
```
https://instagrowth-api.herokuapp.com
```

---

### **Option 4: VPS (DigitalOcean, Linode, AWS)**
✅ **Full control**  
✅ **Supports everything**  
❌ **Requires server management**  
❌ **$5-10/month minimum**

**Your backend URL will be:**
```
https://api.yourdomain.com
```

---

## 🔧 **HOW TO UPDATE THE URLs:**

### **STEP 1: Choose Backend Host**
Pick one of the options above (I recommend Railway.app)

### **STEP 2: Deploy Backend**
Deploy your `backend/` folder to the hosting

### **STEP 3: Get Your Backend URL**
Example: `https://instagrowth-backend.up.railway.app`

### **STEP 4: Update Config Files**

**Edit `web/api-config.js` (Line 5-6):**
```javascript
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://instagrowth-backend.up.railway.app'  // 👈 YOUR RAILWAY URL
    : 'http://localhost:3000';
```

**Edit `admin/api-config.js` (Line 5-6):**
```javascript
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://instagrowth-backend.up.railway.app'  // 👈 SAME URL
    : 'http://localhost:3000';
```

---

## 📝 **EXAMPLE - Complete Setup:**

### **1. Deploy Backend to Railway:**
```bash
# Railway automatically detects backend/package.json
# and runs: npm start
# URL assigned: https://instagrowth-backend.up.railway.app
```

### **2. Update web/api-config.js:**
```javascript
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://instagrowth-backend.up.railway.app'
    : 'http://localhost:3000';
```

### **3. Update admin/api-config.js:**
```javascript
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://instagrowth-backend.up.railway.app'
    : 'http://localhost:3000';
```

### **4. Deploy Frontend to Vercel:**
```bash
# Deploy web/ → https://instagrowth.vercel.app
# Deploy admin/ → https://admin-instagrowth.vercel.app
```

---

## 🎯 **Final URLs Structure:**

```
Main Website:    https://instagrowth.vercel.app
                     ↓ (makes API calls to)
Backend API:     https://instagrowth-backend.up.railway.app/api
                     ↑ (returns data)

Admin Panel:     https://admin-instagrowth.vercel.app
                     ↓ (makes API calls to)
Backend API:     https://instagrowth-backend.up.railway.app/api
```

---

## ⚠️ **IMPORTANT: Don't Change URLs Yet!**

**Current state:** URLs are placeholders  
**When to update:** AFTER you deploy backend and get the actual URL

**Process:**
1. Deploy backend FIRST (get URL)
2. Update api-config.js files
3. Deploy frontend

---

## 🚀 **Recommended Quick Setup (Railway):**

1. **Sign up:** https://railway.app (free)
2. **New Project** → Connect GitHub
3. **Deploy:** Select `backend/` folder
4. **Copy URL:** e.g., `https://xyz.up.railway.app`
5. **Update** both api-config.js files
6. **Deploy** web/ and admin/ to Vercel

---

## 📊 **Cost Comparison:**

| Platform | Free Tier | Perfect For |
|----------|-----------|-------------|
| Railway | ✅ $5 credit/month | SQLite + Node.js ✅ |
| Render | ✅ 750 hours/month | Node.js (use PostgreSQL) |
| Vercel | ❌ Frontend only | Web + Admin ✅ |
| Heroku | ❌ Paid only | - |

**My Recommendation:** Railway.app for backend + Vercel for frontend

---

## ✨ **TL;DR:**

**Backend URL = Whatever hosting platform gives you**

Examples:
- Railway: `https://project-name.up.railway.app`
- Render: `https://project-name.onrender.com`
- Heroku: `https://app-name.herokuapp.com`
- Your VPS: `https://api.yourdomain.com`

**Just replace `'https://your-backend-url.com'` with your ACTUAL backend URL! 🎯**

---

**Last Updated:** 2026-01-19  
**Status:** Ready to deploy after backend hosting is chosen
