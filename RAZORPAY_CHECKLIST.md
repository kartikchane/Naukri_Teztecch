# 🚀 RAZORPAY SETUP - CHECKLIST

## ✅ COMPLETION CHECKLIST

### **PART 1: RAZORPAY ACCOUNT SETUP** (5 mins)

- [ ] Go to https://dashboard.razorpay.com/signup
- [ ] Sign up with email
- [ ] Verify email
- [ ] Fill business details
- [ ] Account created ✅

### **PART 2: GET API KEYS** (2 mins)

**Test Keys (for development)**
- [ ] Go to Settings → API Keys
- [ ] Select "Test" tab
- [ ] Copy Key ID: `rzp_test_xxxxx`
- [ ] Copy Key Secret: `test_secret_xxxxx`

**Live Keys (for production - later)**
- [ ] Go to Settings → API Keys
- [ ] Select "Live" tab (after verification)
- [ ] Copy Key ID: `rzp_live_xxxxx`
- [ ] Copy Key Secret: `live_secret_xxxxx`

### **PART 3: BACKEND SETUP** (5 mins)

```bash
✅ Check 1: Package installed
cd backend
npm list razorpay
# Should show: razorpay@2.8.5 (or similar)

✅ Check 2: .env file created
ls -la .env
# If not exists, create it
```

- [ ] Create/Update `.env` file in backend folder
- [ ] Add Razorpay keys to `.env`:
  ```
  RAZORPAY_KEY_ID=rzp_test_xxxxx
  RAZORPAY_KEY_SECRET=test_secret_xxxxx
  ```
- [ ] Check `.env` is in `.gitignore`
- [ ] Run: `npm run dev`

### **PART 4: FRONTEND SETUP** (2 mins)

- [ ] Plans.js updated with handlePayment function
- [ ] Razorpay script loads automatically
- [ ] Payment modal opens on "Proceed to Pay"

### **PART 5: TESTING** (10 mins)

```bash
✅ Terminal 1: Backend
cd backend
npm run dev
# Output: ✅ Server running on port 5000

✅ Terminal 2: Frontend
cd frontend
npm start
# Output: ✅ Running on http://localhost:3000
```

- [ ] Browser: http://localhost:3000/plans
- [ ] Click "Choose Plan"
- [ ] Click "Proceed to Pay"
- [ ] Test card: `4111 1111 1111 1111`
- [ ] Expiry: Any future date (12/25)
- [ ] CVV: Any 3 digits (123)
- [ ] Click "Pay"
- [ ] ✅ Should get success message
- [ ] ✅ Should redirect to /post-job

### **PART 6: VERIFICATION** (5 mins)

**Check Backend Logs:**
```
✅ STEP 1: Creating subscription order...
✅ Plan found: [Plan Name]
✅ Razorpay order created: order_xxxxx

✅ STEP 2: Verifying payment...
✅ Signature verified!
✅ PAYMENT SUCCESSFUL!
✅ Subscription activated in database
```

**Check Database:**
```javascript
// MongoDB mein check karo
db.subscriptions.findOne({ user: "your_user_id" })

// Should show:
{
  _id: ObjectId,
  status: "active",  // ✅ Active hona chahiye
  payment: {
    paymentStatus: "completed",
    transactionId: "pay_xxxxx"  // Real Razorpay ID
  },
  startDate: ISODate("2026-04-13"),
  endDate: ISODate("2026-05-13")
}
```

**Check Plans Page:**
```
✅ Green banner shows
  "✅ Active Subscription"
  Plan: Premium Plan
  Valid until: [Date]
  Button: "Post a Job Now"
```

---

## 🔥 TROUBLESHOOTING CHECKLIST

### Issue: "RAZORPAY_KEY_ID is undefined"

- [ ] Check `.env` file exists in backend folder
- [ ] Check keys are actually in `.env` (not commented)
- [ ] Restart backend: `npm run dev`
- [ ] Check: `echo $RAZORPAY_KEY_ID` in terminal

### Issue: Razorpay modal doesn't open

- [ ] Browser DevTools (F12) → Console
- [ ] Check for JavaScript errors
- [ ] Check internet connection
- [ ] Try incognito mode (clear cache)
- [ ] Check CORS in server.js

### Issue: "Payment verification failed"

- [ ] Check Razorpay dashboard for payment
- [ ] Verify backend is running
- [ ] Check backend console logs
- [ ] Verify signature calculation
- [ ] Clear browser cache

### Issue: Subscription shows as "pending"

- [ ] Check Razorpay dashboard: Payment captured?
- [ ] Check `/subscriptions/verify-payment` called?
- [ ] Check backend logs for errors
- [ ] Check payment verification response

### Issue: Can't post job after payment

- [ ] Refresh browser page
- [ ] Check subscription status: `/subscriptions/my-subscription`
- [ ] Check endDate is in future
- [ ] Check subscription.status = "active"

---

## 📊 PAYMENT STATUS MEANINGS

| Status | Meaning | Action |
|--------|---------|--------|
| pending | Payment awaiting | User hasn't paid yet |
| completed | Payment successful | ✅ Subscription active |
| failed | Payment rejected | Retry payment |
| refunded | Money returned | Contact support |

---

## 🔐 SECURITY CHECKLIST

- [ ] `.env` never committed to Git
- [ ] Add `.env` to `.gitignore`
- [ ] Razorpay keys are SECRET
- [ ] Payment verification on backend
- [ ] HTTPS enabled (production)
- [ ] Signature validation enabled
- [ ] User authorization checks

---

## 📈 METRICS TO TRACK

After payment successful,track:

```javascript
// Database fields to monitor
{
  subscription: {
    status: "active",           // ✅ Active
    paymentStatus: "completed", // ✅ Completed
    transactionId: "pay_xxxxx", // Real payment ID
    paymentDate: "2026-04-13",  // Payment date
    amount: 99,                 // Amount paid
    currency: "INR",            // Currency
    startDate: "2026-04-13",    // Start date
    endDate: "2026-05-13"       // Expiry date
  }
}
```

---

## ✨ FINAL VERIFICATION

**Everything Ready?**

- [ ] Razorpay account created
- [ ] API keys obtained
- [ ] Backend `.env` updated
- [ ] Frontend payment modal integrated
- [ ] Backend verification logic active
- [ ] Test payment successful
- [ ] Success message shown
- [ ] Redirect to /post-job working
- [ ] Can post job after payment

**If all ✅, then you're READY FOR PRODUCTION!**

---

## 🚀 NEXT: PRODUCTION DEPLOYMENT

When ready to go live:

1. Switch to LIVE keys in Razorpay
2. Update `.env` with live keys
3. Enable HTTPS
4. Test with small amount first
5. Monitor payments in Razorpay dashboard
6. Setup webhook (optional, for reliability)

---

**All set? Let's go! 🎉**
