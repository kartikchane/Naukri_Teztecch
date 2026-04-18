# 💳 Razorpay Payment Integration Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Free Razorpay Account
1. Visit: https://dashboard.razorpay.com/signup
2. Sign up with email & password (FREE - no credit card required)
3. Verify your email

### Step 2: Get Your API Keys

**For Testing:**
1. Login to Razorpay dashboard
2. Go to **Settings** → **API Keys**
3. You'll see two tabs: **Live** and **Test**
4. Click **Test** tab
5. Copy your **Key ID** (starts with `rzp_test_`)
6. Copy your **Key Secret**

**For Production:**
1. Complete your business verification
2. Click **Live** tab
3. Copy **Key ID** (starts with `rzp_live_`)
4. Copy **Key Secret**

### Step 3: Update Your .env File

```bash
# Create/Update .env in backend folder
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### Step 4: Restart Backend
```bash
cd backend
npm install razorpay  # If not already done
npm run dev           # or npm start
```

---

## Testing Payment Flow

### Test Card Details:
| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| Visa Success | `4111 1111 1111 1111` | Any future date | Any 3 digits |
| Visa Failure | `4111 1111 1111 0002` | Any future date | Any 3 digits |
| Mastercard | `5555 5555 5555 4444` | Any future date | Any 3 digits |

### Test Steps:
1. Go to Plans page: `/plans`
2. Click "Choose Plan"
3. Click "Proceed to Pay"
4. Razorpay modal opens
5. Use test card above
6. Complete payment
7. Should see success message

---

## Payment Flow Diagram

```
Frontend (React)
├─ User selects plan
├─ Calls POST /api/subscriptions/create
│  └─ Sends: planId, paymentMethod
│
Backend (Express)
├─ Creates pending subscription
├─ Calls Razorpay API to create order
├─ Returns: orderId, amount, key
│
Frontend
├─ Opens Razorpay Checkout modal
├─ User completes payment
├─ Gets: paymentId, orderId, signature
│
Frontend
├─ Calls POST /api/subscriptions/verify-payment
│  └─ Sends: subscriptionId, paymentId, orderId, signature
│
Backend
├─ Verifies HMAC signature
├─ Calls Razorpay to confirm payment
├─ If valid: Activates subscription
├─ Returns: success message
│
Frontend
├─ Shows success toast
└─ Redirects to /post-job
```

---

## API Endpoints

### Create Subscription (Purchase)
```
POST /api/subscriptions/create

Request Body:
{
  "planId": "507f1f77bcf86cd799439011",
  "paymentMethod": "credit-card"
}

Response:
{
  "message": "Payment order created...",
  "subscription": {
    "_id": "...",
    "status": "pending",
    ...
  },
  "razorpayOrder": {
    "orderId": "order_...",
    "amount": 99900,  // in paise
    "currency": "INR",
    "key": "rzp_test_xxx"
  }
}
```

### Verify Payment (After Payment)
```
POST /api/subscriptions/verify-payment

Request Body:
{
  "subscriptionId": "507f1f77bcf86cd799439011",
  "razorpayPaymentId": "pay_...",
  "razorpayOrderId": "order_...",
  "razorpaySignature": "signature_hash"
}

Response:
{
  "message": "Successfully subscribed...",
  "subscription": {...},
  "verified": true
}
```

### Get Current Subscription
```
GET /api/subscriptions/my-subscription

Response:
{
  "_id": "...",
  "user": "...",
  "plan": {...},
  "status": "active",
  "endDate": "2026-05-13",
  ...
}
```

---

## Troubleshooting

### Issue: `Error: RAZORPAY_KEY_ID not defined`
**Solution:**
1. Check `.env` file exists in backend folder
2. Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
3. Restart backend server
4. Check: `echo $RAZORPAY_KEY_ID` (should print key)

### Issue: Payment modal doesn't open
**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify internet connection
4. Clear browser cache
5. Try incognito mode

### Issue: "Payment verification failed"
**Solution:**
1. Check signature validation in backend logs
2. Verify payment in Razorpay dashboard
3. Check timestamps aren't too old
4. Ensure both test/live keys are consistent

### Issue: Subscription shows "pending"
**Solution:**
1. Verify payment was successful in Razorpay dashboard
2. Check `/subscriptions/verify-payment` was called
3. Check backend logs for verification errors
4. Manually change status in MongoDB if needed (admin only)

---

## Production Checklist

Before deploying to production:

- [ ] Switch from **Test** keys to **Live** keys
- [ ] Update `.env` with production Razorpay keys
- [ ] Verify HTTPS is enabled (required for prod)
- [ ] Test payment flow with live keys
- [ ] Set `NODE_ENV=production`
- [ ] Enable logging for payment transactions
- [ ] Setup email notifications for payments
- [ ] Add webhook handler (optional, for reliability)
- [ ] Test refund flow
- [ ] Add SSL certificate

---

## Security Best Practices

1. **Never commit `.env`** - Add to `.gitignore`
2. **Rotate keys regularly** - Change every 6 months
3. **Use HTTPS only** - Never HTTP for payments
4. **Validate signatures** - Always verify on backend
5. **Log transactions** - Keep audit trail
6. **Monitor failures** - Alert on failed payments
7. **PCI Compliance** - Never store card numbers

---

## Support Resources

- **Razorpay Docs**: https://razorpay.com/docs
- **Test Card List**: https://razorpay.com/docs/payments/payments/test-cards/
- **Dashboard**: https://dashboard.razorpay.com
- **Support**: support@razorpay.com

---

**Need Help?** Check browser console & backend logs for detailed error messages!
