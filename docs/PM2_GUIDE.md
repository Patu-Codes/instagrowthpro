# 🚀 **PM2 QUICK REFERENCE GUIDE**

## ✅ **PM2 is NOW RUNNING YOUR BACKEND!**

Your backend is now running 24/7 in the background with PM2 process manager.

---

## 📋 **ESSENTIAL PM2 COMMANDS**

### **View Running Processes:**
```bash
pm2 list
```
Shows all apps managed by PM2

### **View Logs (Real-time):**
```bash
pm2 logs instagrowth-backend
```
See what's happening in your backend

### **View Logs (Last 100 lines):**
```bash
pm2 logs instagrowth-backend --lines 100
```

### **Stop Backend:**
```bash
pm2 stop instagrowth-backend
```

### **Restart Backend:**
```bash
pm2 restart instagrowth-backend
```

### **Delete from PM2:**
```bash
pm2 delete instagrowth-backend
```

### **View Detailed Info:**
```bash
pm2 show instagrowth-backend
```

### **Monitor (Dashboard):**
```bash
pm2 monit
```
Real-time CPU/Memory usage

---

## 🔄 **AUTO-START ON WINDOWS BOOT**

To make PM2 start automatically when Windows restarts:

### **1. Generate Startup Script:**
```bash
pm2 startup
```

### **2. Copy & Run the Command it Shows**
It will show something like:
```
[PM2] You have to run this command as administrator:
pm2 startup ...
```

### **3. Save Current Process List:**
```bash
pm2 save
```

Now your backend will:
- ✅ Start automatically on Windows boot
- ✅ Keep running 24/7
- ✅ Auto-restart if it crashes

---

## 📊 **CHECK STATUS**

### **Quick Status:**
```bash
pm2 status
```

### **Full Monitoring:**
```bash
pm2 monit
```
Press `Ctrl+C` to exit

---

## 🔧 **USEFUL SCENARIOS**

### **Scenario 1: Backend Crashed**
```bash
pm2 restart instagrowth-backend
```

### **Scenario 2: Updated Code**
```bash
pm2 restart instagrowth-backend
```
PM2 will reload your new code

### **Scenario 3: Check if Running**
```bash
pm2 list
```
Look for status: `online` ✅

### **Scenario 4: See Errors**
```bash
pm2 logs instagrowth-backend --err
```

### **Scenario 5: Clear Logs**
```bash
pm2 flush
```

---

## 💡 **PM2 FEATURES YOU'RE USING**

- ✅ **Zero-Downtime**: Backend keeps running
- ✅ **Auto-Restart**: If crash, PM2 restarts it
- ✅ **Background Process**: Can close cmd, backend still runs
- ✅ **Log Management**: All logs saved
- ✅ **Monitoring**: See CPU/Memory usage
- ✅ **Startup Script**: Auto-start on boot

---

## 🎯 **WHAT'S HAPPENING NOW**

Your backend (`backend-server.js`) is now:
1. ✅ Running in the background
2. ✅ Managed by PM2
3. ✅ Will auto-restart if it crashes
4. ✅ Logs are being saved
5. ✅ You can close this terminal - backend keeps running!

---

## 📍 **IMPORTANT PATHS**

**PM2 Logs Location:**
```
C:\Users\Prathamesh\.pm2\logs\
```

**PM2 Config:**
```
C:\Users\Prathamesh\.pm2\
```

---

## 🛑 **STOPPING PM2 COMPLETELY**

If you want to stop everything:
```bash
pm2 stop all
pm2 delete all
```

---

## 🔥 **ADVANCED COMMANDS**

### **Update PM2:**
```bash
npm install -g pm2@latest
pm2 update
```

### **Restart All Apps:**
```bash
pm2 restart all
```

### **Reload (Zero Downtime):**
```bash
pm2 reload instagrowth-backend
```

### **Set Memory Limit:**
```bash
pm2 start backend-server.js --name instagrowth-backend --max-memory-restart 500M
```

---

## 📞 **TROUBLESHOOTING**

### **Problem: PM2 command not found**
**Solution:**
```bash
npm install -g pm2
```

### **Problem: Backend not starting**
**Solution:**
```bash
pm2 logs instagrowth-backend
```
Check error messages

### **Problem: Port already in use**
**Solution:**
```bash
pm2 delete instagrowth-backend
taskkill /F /IM node.exe
pm2 start backend-server.js --name instagrowth-backend
```

### **Problem: Want to see what's running**
**Solution:**
```bash
pm2 list
pm2 monit
```

---

## ✅ **TO VERIFY IT'S WORKING**

1. Open browser: http://localhost:3000
2. Or check: `pm2 list` - should show `online`
3. Or check logs: `pm2 logs instagrowth-backend`

---

## 🎉 **CONGRATULATIONS!**

Your backend is now professionally managed and will run 24/7!

**Next Steps:**
- Test your website: http://localhost:8000
- Backend is at: http://localhost:3000
- Check PM2 dashboard: `pm2 monit`

---

**Created:** 2026-01-15
**Process Manager:** PM2
**Backend:** Running 24/7 ✅
