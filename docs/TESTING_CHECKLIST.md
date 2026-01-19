# 🧪 MANUAL TESTING CHECKLIST

## Test the Complete Order Flow

### ✅ Step 1: Create Account
1. Open: http://localhost:8000/register.html
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123`
3. Click "Create Account"
4. **Expected**: Success message, redirected to home

### ✅ Step 2: Place an Order
1. Navigate to: http://localhost:8000/order.html
2. Fill in form:
   - Instagram Username: `johndoe123`
   - Instagram Profile Link: `https://instagram.com/johndoe123`
   - WhatsApp: `+1234567890` (optional)
   - Select Package: **Starter (100 followers)**
3. Click "Proceed to Payment"
4. **Expected**: Redirected to payment page with order summary

### ✅ Step 3: Complete Payment
1. On payment page, review order details
2. Click "I've Completed Payment"
3. **Expected**: 
   - Success message appears
   - Redirected to confirmation page
   - Order saved successfully (NO ERROR)

### ✅ Step 4: View Order in Admin Panel
1. Open: http://localhost:8001
2. Login with admin credentials
3. Navigate to Orders page
4. **Expected**: 
   - See the test order
   - All fields visible: orderId, profileUsername, profileLink, Instagram ID, package, amount, status
   - Profile Link shows as clickable "Link"

### ✅ Step 5: Verify "My Orders"
1. Go back to main site: http://localhost:8000
2. Click "My Orders" in navigation
3. **Expected**: See your test order in the list

---

## 🎯 Success Criteria

- [ ] Account creation works
- [ ] Login works
- [ ] Order form accepts all fields
- [ ] Payment completion saves order (NO ERROR!)
- [ ] Order appears in admin panel with profileLink
- [ ] Order appears in user's "My Orders"
- [ ] Profile Link is clickable in admin panel

---

## 📝 Notes

If ANY step fails, note the error message for debugging.

**Start testing from Step 1!**
