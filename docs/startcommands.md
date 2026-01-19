# Start Commands

## Starting the Application

### 1. Start Main Website Server (Port 8000)
```bash
python -m http.server 8000 --directory public
```

### 2. Start Admin Panel Server (Port 8001)
```bash
python -m http.server 8001 --directory "ADMIN PANEL APP"
```

### 3. Open Main Website
```bash
start http://localhost:8000
```

### 4. Open Admin Panel
```bash
start http://localhost:8001
```

---

## Quick Start (All in One)

Open **4 separate terminals** and run:

**Terminal 1 - Main Server:**
```bash
cd "c:/Users/Prathamesh/OneDrive/Documents/WORK/Insta follower sell web"
python -m http.server 8000 --directory public
```

**Terminal 2 - Admin Server:**
```bash
cd "c:/Users/Prathamesh/OneDrive/Documents/WORK/Insta follower sell web"
python -m http.server 8001 --directory "ADMIN PANEL APP"
```

**Terminal 3 - Open Main App:**
```bash
start http://localhost:8000
```

**Terminal 4 - Open Admin App:**
```bash
start http://localhost:8001
```

---

## Access URLs

- **Main Website**: http://localhost:8000
- **Admin Panel**: http://localhost:8001
- **Backend API**: http://localhost:3000 (runs via PM2)

---

## Important Notes

- Keep terminals open while using the applications
- Press `Ctrl+C` in terminal to stop servers
- Backend API runs automatically via PM2 (no manual start needed)
