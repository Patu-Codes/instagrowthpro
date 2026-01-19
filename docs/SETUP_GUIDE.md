# Quick Setup Guide

## Step 1: Firebase Setup (5 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Name it "InstaGrowth Pro" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Enable Firestore Database
1. In Firebase Console, click "Firestore Database"
2. Click "Create Database"
3. Select "Start in production mode"
4. Choose a location (closest to your users)
5. Click "Enable"

### Set Firestore Rules (Important!)
1. Go to Firestore > Rules
2. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{order} {
      allow read, write: if true;  // For development only!
      // TODO: Add proper authentication for production
    }
  }
}
```

3. Click "Publish"

⚠️ **Note**: These rules allow anyone to read/write. For production, add authentication!

### Get Firebase Config
1. Click the gear icon ⚙️ > Project Settings
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Register your app (name: "InstaGrowth Web")
5. Copy the `firebaseConfig` object

### Download Service Account Key
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file as `firebase-service-account.json` in your project root
4. **NEVER** commit this file to Git!

## Step 2: Configure the Application

### Update Firebase Config in Frontend Files

Replace the Firebase config in these 5 files:
- `public/app.js`
- `public/order.js`  
- `public/payment.js`
- `public/confirmation.js`
- `public/admin.js`

Find this section and replace with your config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### Create .env File

```bash
cp .env.example .env
```

Edit `.env` and add your values (not critical for basic functionality).

## Step 3: Run the Application

```bash
npm start
```

Open browser: http://localhost:8000

## Step 4: Test the Application

### Test Order Flow:
1. Visit http://localhost:8000
2. Click "Get Started" or "Order Now"
3. Fill in the order form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Select any package
4. Click "Proceed to Payment"
5. On payment page, click "I've Completed Payment"
6. You'll see the confirmation page

### Test Admin Panel:
1. Visit http://localhost:3000/admin.html
2. You should see your test order
3. Click "Update" to change order status
4. Try changing status to "Processing" or "Completed"

### Test Real-time Updates:
1. Open confirmation page in one browser tab
2. Open admin panel in another tab
3. Update the order status in admin
4. Watch the confirmation page update in real-time! 🎉

## Step 5: Add Your UPI QR Code

Replace `public/qr-code.jpg` with your actual UPI QR code image.

## Common Issues & Solutions

### Issue: Orders not appearing in admin panel
**Solution**: Check browser console for errors. Make sure Firebase config is correct.

### Issue: "Permission denied" error
**Solution**: Check Firestore rules. Make sure read/write is allowed.

### Issue: Server won't start
**Solution**: 
- Make sure `firebase-service-account.json` exists
- Check if port 3000 is already in use
- Run `npm install` again

### Issue: Real-time updates not working
**Solution**: Make sure you're using the same Firebase project in all JS files.

## Production Checklist

Before going live:

- [ ] Update Firestore security rules (add authentication!)
- [ ] Add admin authentication/password
- [ ] Use environment variables for all config
- [ ] Set up HTTPS (required for payment processing)
- [ ] Test on mobile devices
- [ ] Add proper error handling
- [ ] Set up email notifications
- [ ] Verify UPI QR code works
- [ ] Add terms & conditions page
- [ ] Add privacy policy page
- [ ] Set up domain and hosting

## Need Help?

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Guide: https://firebase.google.com/docs/firestore
- Node.js Docs: https://nodejs.org/docs

## Next Steps

1. **Add Authentication**: Secure your admin panel
2. **Email Notifications**: Send order confirmations
3. **WhatsApp Integration**: Notify customers via WhatsApp
4. **Razorpay Integration**: Add card payments
5. **Analytics**: Track conversions and revenue

---

🎉 Congratulations! Your Instagram Growth Services platform is ready!
