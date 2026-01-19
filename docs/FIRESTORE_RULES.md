# Firebase Firestore Security Rules

## Important: Set These Rules in Firebase Console

1. Go to **Firebase Console**: https://console.firebase.google.com/
2. Select your project: **instagrow-x**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab
5. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Orders collection - Allow public read/write for now (DEVELOPMENT ONLY!)
    match /orders/{orderId} {
      // Allow anyone to create orders (for customer orders)
      allow create: if true;
      
      // Allow anyone to read orders (for order tracking)
      allow read: if true;
      
      // Allow anyone to update orders (for payment confirmation and admin updates)
      allow update: if true;
      
      // Allow anyone to delete (for admin - should add auth later)
      allow delete: if true;
    }
  }
}
```

6. Click **Publish** button

⚠️ **IMPORTANT FOR PRODUCTION:**

These rules are open for development/testing. Before going live, you MUST add authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /orders/{orderId} {
      // Customers can create orders
      allow create: if true;
      
      // Customers can read their own orders, admins can read all
      allow read: if true; // TODO: Add authentication
      
      // Only admins can update/delete orders
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Testing the Connection

Once you've set the rules:

1. Refresh your browser at http://localhost:8000
2. Try placing an order
3. Check the browser console (F12) - should show no Firebase errors
4. Check Firebase Console > Firestore Database > Data tab
5. You should see an "orders" collection with your test order!

## Verifying It Works

**Test Order Flow:**
1. Go to http://localhost:8000/order.html
2. Fill in the form
3. Submit order
4. Check Firebase Console - order should appear in Firestore!
5. Go to http://localhost:8000/admin.html
6. Your order should appear in the admin panel!

**Real-time Updates Test:**
1. Open admin panel
2. Open confirmation page in another tab
3. Update order status in admin
4. Confirmation page should update automatically! 🎉
