# InstaGrowth Pro - Instagram Growth Services

A modern, professional web platform for selling Instagram followers with secure payment processing and order management.

## Features

- 🎨 **Stunning Dark Theme UI** - Premium glassmorphism design with smooth animations
- 📱 **Mobile-First Responsive** - Perfect on all devices
- 💳 **UPI Payment Integration** - QR code and UPI ID support
- 🔒 **Secure & Fast** - Firebase backend with real-time updates
- 📊 **Admin Dashboard** - Complete order management system
- 🔔 **Real-time Notifications** - Order status updates
- 📈 **Analytics Dashboard** - Track revenue and orders

## Tech Stack

- **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting (recommended) or any Node.js hosting

## Project Structure

```
insta-growth-services/
├── public/
│   ├── index.html          # Homepage
│   ├── order.html          # Order form
│   ├── payment.html        # Payment page
│   ├── confirmation.html   # Order confirmation
│   ├── admin.html          # Admin panel
│   ├── styles.css          # Main stylesheet
│   ├── order.css           # Order page styles
│   ├── payment.css         # Payment page styles
│   ├── confirmation.css    # Confirmation styles
│   ├── admin.css           # Admin panel styles
│   ├── app.js              # Main JavaScript
│   ├── order.js            # Order form logic
│   ├── payment.js          # Payment logic
│   ├── confirmation.js     # Confirmation logic
│   ├── admin.js            # Admin panel logic
│   └── qr-code.jpg         # UPI QR code
├── server.js               # Express backend
├── package.json            # Dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set rules to allow read/write (or customize based on your needs)
4. Get your Firebase config:
   - Project Settings > General > Your apps
   - Copy the config object
5. Download service account key:
   - Project Settings > Service Accounts
   - Generate new private key
   - Save as `firebase-service-account.json` in project root

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file and add your Firebase credentials.

### 4. Update Firebase Config

Update the Firebase configuration in these files:
- `public/app.js`
- `public/order.js`
- `public/payment.js`
- `public/confirmation.js`
- `public/admin.js`

Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 5. Add Your UPI QR Code

Replace `public/qr-code.jpg` with your actual UPI payment QR code image.

### 6. Run the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Pages

- **Homepage** (`/`) - Landing page with features and pricing
- **Order Page** (`/order.html`) - Order form with package selection
- **Payment Page** (`/payment.html`) - UPI payment with QR code
- **Confirmation** (`/confirmation.html`) - Order confirmation and tracking
- **Admin Panel** (`/admin.html`) - Order management dashboard

## Pricing Tiers

| Package | Followers | Price (INR) | Price (USD) |
|---------|-----------|-------------|-------------|
| Starter | 100       | ₹349        | $5          |
| Growth  | 200       | ₹699        | $10         |
| Pro     | 500       | ₹1,699      | $24         |
| Elite   | 1,000     | ₹3,099      | $45         |

## Order Statuses

- **Pending** - Payment received, awaiting processing
- **Processing** - Currently delivering followers
- **Completed** - All followers delivered successfully

## Admin Panel Features

- View all orders in real-time
- Filter by status (Pending, Processing, Completed)
- Search by order ID or username
- Update order status
- View detailed order information
- Dashboard statistics:
  - Total pending orders
  - Orders in processing
  - Completed orders
  - Total revenue

## Security Notes

1. **Never commit** `.env` file or `firebase-service-account.json`
2. Add proper Firestore security rules
3. For production, add authentication to admin panel
4. Use HTTPS for production deployment
5. Validate UPI payments on backend

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

4. Deploy:
```bash
firebase deploy
```

### Other Hosting Options

- **Heroku**: Add `Procfile` with `web: node server.js`
- **Vercel**: Works out of the box
- **DigitalOcean/AWS**: Deploy as Node.js app

## Payment Integration Notes

Currently supports UPI payments. To add Razorpay:

1. Sign up for [Razorpay](https://razorpay.com/)
2. Get API keys
3. Add Razorpay SDK to payment page
4. Update payment.js with Razorpay integration
5. Handle payment verification on backend

## Manual Fulfillment Workflow

1. Customer places order and pays
2. Order appears in admin panel with "Pending" status
3. Admin verifies payment
4. Admin manually delivers followers
5. Admin updates status to "Processing" then "Completed"
6. Customer receives real-time notification

## Customization

- Update pricing in `order.js` and `index.html`
- Modify color scheme in `styles.css` (CSS variables)
- Add more payment methods in `payment.html`
- Customize email/WhatsApp notifications in `server.js`

## Support

For issues or questions, contact your development team.

## License

Proprietary - All rights reserved

---

Built with ❤️ for Instagram Growth Services
