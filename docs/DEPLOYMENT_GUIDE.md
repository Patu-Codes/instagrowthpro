# 🚀 **DEPLOYMENT GUIDE - InstaGrowth Pro**

## ❓ **Your Question: How to Keep Backend Running?**

You're absolutely right! After deployment, you **CANNOT manually start the backend** every time. The backend must run 24/7 automatically.

### **Why Backend Must Run Continuously:**
- ✅ Users can login anytime
- ✅ Orders are processed
- ✅ Chat system works
- ✅ Database operations happen
- ✅ API endpoints are always available

---

## 🌐 **DEPLOYMENT OPTIONS**

### **Option 1: Free Hosting (Recommended for Testing)**

#### **A. Render.com (FREE - Best for Beginners)**
**Cost:** FREE forever
**Features:**
- Auto-deploys from GitHub
- Backend runs 24/7 (with limitations)
- Free SSL certificate
- SQLite database works

**Steps:**
1. Create account: https://render.com
2. Connect GitHub repository
3. Create "Web Service"
4. Build command: `npm install`
5. Start command: `node backend-server.js`
6. Deploy!

**Limitations:**
- Sleeps after 15 min of inactivity (free tier)
- Wakes up automatically when accessed
- May take 30-50 seconds to wake up

---

#### **B. Railway.app (FREE $5 credit/month)**
**Cost:** FREE $5 credit monthly
**Features:**
- Better than Render
- No sleep mode
- Faster performance

**Steps:**
1. Sign up: https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Auto-deploys on git push

---

#### **C. Vercel (Frontend) + Railway (Backend)**
**Cost:** FREE
**Best Setup:**
- **Vercel**: Host frontend (HTML/CSS/JS files)
- **Railway**: Host backend (Node.js server)

---

### **Option 2: VPS Hosting (Paid - Production Ready)**

#### **A. DigitalOcean Droplet**
**Cost:** $6/month
**Features:**
- Full control
- Never sleeps
- Best performance
- Your own server

**Steps:**
1. Create droplet (Ubuntu)
2. SSH into server
3. Install Node.js
4. Install PM2 (process manager)
5. Clone your code
6. Run with PM2

---

#### **B. AWS EC2 Free Tier**
**Cost:** FREE for 1 year (12 months)
**Features:**
- Amazon's cloud
- Professional setup
- Free domain available

---

## 🔄 **KEEPING BACKEND RUNNING 24/7**

### **Solution: PM2 Process Manager**

PM2 keeps your Node.js backend running forever, even after server restarts!

#### **Install PM2:**
```bash
npm install -g pm2
```

#### **Start Backend with PM2:**
```bash
pm2 start backend-server.js --name "instagrowth-backend"
```

#### **PM2 Commands:**
```bash
# Start backend
pm2 start backend-server.js

# View running processes
pm2 list

# View logs
pm2 logs

# Restart backend
pm2 restart instagrowth-backend

# Stop backend
pm2 stop instagrowth-backend

# Auto-start on server reboot
pm2 startup
pm2 save
```

#### **Why PM2 is Amazing:**
- ✅ Auto-restart if backend crashes
- ✅ Auto-start on server reboot
- ✅ Load balancing
- ✅ Zero-downtime reload
- ✅ Monitoring

---

## 📁 **DATABASE IN PRODUCTION**

### **Current Setup (SQLite):**
Your `instagrowth.db` file works fine for small-medium traffic.

### **Scaling Options:**

#### **Option 1: Keep SQLite (Simple)**
- Good for: Up to 10,000 users
- Backup: Copy .db file regularly

#### **Option 2: PostgreSQL (Professional)**
- Good for: Unlimited users
- Free on: Railway, Render, Supabase
- Requires: Code changes

#### **Option 3: MongoDB Atlas (Free)**
- Free tier: 512MB
- Cloud database
- Good for chat data

---

## 🎯 **RECOMMENDED SETUP FOR YOU**

### **Best Free Setup:**
```
Frontend: Vercel (free forever)
Backend: Render.com or Railway (free)
Database: SQLite (current setup works)
Domain: Freenom (.tk domain) or Namecheap ($1/year)
```

### **Best Paid Setup ($6/month):**
```
Frontend + Backend: DigitalOcean Droplet
Database: SQLite or PostgreSQL
Process Manager: PM2
Domain: Your custom domain
```

---

## 🚀 **STEP-BY-STEP DEPLOYMENT (Render.com)**

### **1. Prepare Your Code**

Create `package.json ` if not exists:
```json
{
  "name": "instagrowth-backend",
  "version": "1.0.0",
  "main": "backend-server.js",
  "scripts": {
    "start": "node backend-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "nodemailer": "^7.0.12"
  }
}
```

### **2. Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### **3. Deploy on Render**
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Settings:
   - Name: `instagrowth-backend`
   - Environment: `Node`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: `Free`
6. Click "Create Web Service"

### **4. Update Frontend URLs**

After deployment, Render gives you a URL like:
```
https://instagrowth-backend.onrender.com
```

Update all API calls in frontend:
```javascript
// OLD (local):
fetch('http://localhost:3000/api/...')

// NEW (production):
fetch('https://instagrowth-backend.onrender.com/api/...')
```

Files to update:
- `login.js`
- `register.js`
- `order.js`
- `profile.js`
- `contact-form.js`
- `chat-widget.js`

### **5. Deploy Frontend on Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd public
vercel

# Follow prompts
```

---

## 🔐 **PRODUCTION CHECKLIST**

### **Before Going Live:**

- [ ] Update all API URLs (localhost → production)
- [ ] Add CORS for your domain only
- [ ] Hide sensitive data (Gmail password in env)
- [ ] Test all features (login, order, chat)
- [ ] Backup database
- [ ] Set up monitoring
- [ ] Add error logging
- [ ] SSL certificate (auto on Render/Vercel)
- [ ] Custom domain (optional)

---

## 🛡️ **ENVIRONMENT VARIABLES**

Never expose passwords in code! Use environment variables:

**On Render/Railway:**
```
GMAIL_USER=neomatrix.studio@gmail.com
GMAIL_PASSWORD=uojtvvcwedovoelv
PORT=3000
```

**In code (backend-server.js):**
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});
```

---

## 💰 **COST COMPARISON**

| Service | Cost | Uptime | Best For |
|---------|------|--------|----------|
| Render Free | $0 | 99% (sleeps) | Testing |
| Railway | $0-5 | 99.9% | Small sites |
| DigitalOcean | $6/mo | 99.99% | Production |
| AWS EC2 | Free→$10 | 99.99% | Scalable |
| Vercel (Frontend) | $0 | 100% | All sites |

---

## 📊 **MONITORING**

### **Free Tools:**
- **UptimeRobot**: Check if backend is up (free)
- **PM2 Monitoring**: Built-in dashboard
- **Render Logs**: View backend logs
- **Google Analytics**: Track frontend visitors

---

## 🆘 **COMMON ISSUES**

### **Issue: Backend sleeps on free tier**
**Solution:** 
- Upgrade to paid tier ($7/month)
- Or use UptimeRobot to ping every 5 min

### **Issue: CORS errors**
**Solution:**
```javascript
app.use(cors({ 
    origin: 'https://your-frontend.vercel.app',
    credentials: true 
}));
```

### **Issue: Database not found**
**Solution:** 
- SQLite file must be in same directory
- Or use cloud database

---

## ✅ **FINAL ANSWER TO YOUR QUESTION**

**Q: How will backend run without manual start?**

**A: Three Ways:**

1. **Free Hosting (Render/Railway):**
   - Push code to GitHub
   - Connect to Render
   - Render automatically starts & keeps backend running
   - No manual intervention needed
   - Backend runs 24/7 (with limitations on free tier)

2. **VPS + PM2:**
   - Rent a server ($6/month)
   - Install PM2
   - PM2 keeps backend running forever
   - Auto-restarts on crashes/reboots

3. **Serverless (Advanced):**
   - Use AWS Lambda or Vercel Functions
   - Backend runs on-demand
   - More complex setup

**Recommended:** Start with Render (free), then upgrade to DigitalOcean when you have users.

---

## 📞 **NEED HELP DEPLOYING?**

I can help you deploy! Just follow this guide or ask for step-by-step assistance.

---

**Created:** 2026-01-15
**For:** InstaGrowth Pro Production Deployment
