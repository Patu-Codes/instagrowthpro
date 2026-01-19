📧 **EMAIL SUPPORT SYSTEM SETUP GUIDE**

## ⚠️ IMPORTANT: Gmail App Password Required

To enable email sending, you need to create a Gmail App Password:

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", find "2-Step Verification"
   - If not enabled, enable it first
4. Once 2-Step Verification is enabled, you'll see "App passwords"
5. Click "App passwords"
6. Select app: "Mail"
7. Select device: "Other (Custom name)"
8. Enter name: "InstaGrowth Pro Backend"
9. Click "Generate"
10. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

### Step 2: Add Password to Backend

Open `backend-server.js` and find this section (around line 300):

```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'neomatrix.studio@gmail.com',
        pass: 'YOUR_APP_PASSWORD_HERE' // ← Replace this
    }
});
```

Replace `'YOUR_APP_PASSWORD_HERE'` with your app password (remove spaces):
```javascript
pass: 'abcdefghijklmnop'
```

### Step 3: Restart Backend Server

1. Stop the current backend (Ctrl+C in terminal)
2. Run: `node backend-server.js`
3. You should see: ✅ Contact messages table ready

### Step 4: Test Email System

1. Go to: http://localhost:8000/contact-support.html
2. Fill out the contact form
3. Click "Send Message"
4. Check neomatrix.studio@gmail.com inbox
5. User should also receive auto-reply

## 🔒 Security Notes

- Never commit the app password to Git
- The password is only in backend-server.js (not exposed to users)
- Users only interacts with the form on frontend

## ✅ What's Implemented

- ✅ Contact form with validation
- ✅ Messages saved to database
- ✅ Email sent to: neomatrix.studio@gmail.com
- ✅ Auto-reply sent to customer
- ✅ Professional HTML email templates
- ✅ Admin can view all messages via API
- ✅ Error handling if email fails

## 📍 Files Created/Modified

1. `backend-server.js` - Added email endpoints
2. `contact-support.html` - Updated with working form
3. `contact-form.js` - Form handling logic
4. `EMAIL_SETUP.md` - This guide

## 🚀 Frontend is Ready!

The contact form on the website is now fully functional. Just add the Gmail App Password and restart the server!
