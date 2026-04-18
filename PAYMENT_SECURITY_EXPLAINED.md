# 💳 RAZORPAY PAYMENT - HOW IT WORKS (TECHNICAL DEEP DIVE)

## 📍 PART 1: PAYMENT CREATION PROCESS

### What Happens When User Clicks "Proceed to Pay"?

```
┌────────────────────────────────────────────────────────────┐
│              FRONTEND: Plans.js                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  User chooses plan & clicks "Proceed to Pay"            │
│                ↓                                          │
│  handlePayment() function calls                           │
│                ↓                                          │
│  API.post('/subscriptions/create', {                     │
│    planId: "60d...",                                     │
│    paymentMethod: "credit-card"                          │
│  })                                                      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Backend Receives Create Request

```javascript
// backend/routes/subscriptions.js - POST /api/subscriptions/create

1️⃣  Validate input
    ├─ planId exists?
    └─ paymentMethod valid?

2️⃣  Check Plan Details
    ├─ Get plan from database
    ├─ Get plan price
    └─ Get plan features

3️⃣  Check Existing Subscriptions
    ├─ User already has active subscription?
    ├─ If yes → Return error
    └─ If no → Continue

4️⃣  Calculate Dates
    ├─ startDate = Today
    └─ endDate = Today + (months from plan)
       Example: 1 month plan
       startDate: 2026-04-13
       endDate:   2026-05-13

5️⃣  Create Subscription in Database (PENDING status)
    ├─ user: user_id
    ├─ plan: plan_id
    ├─ type: "job-posting"
    ├─ status: "pending"        ← ⚠️ NOT ACTIVE YET
    ├─ amount: 99               ← Plan price
    └─ payment:
        ├─ paymentMethod: "credit-card"
        ├─ paymentStatus: "pending"
        └─ transactionId: null

6️⃣  Call Razorpay API
    ├─ Create order with parameters
    │   ├─ amount: 9900           (paise = rupees × 100)
    │   ├─ currency: "INR"
    │   ├─ receipt: subscription_id
    │   └─ notes: {user info, plan info}
    │
    └─ Razorpay responds with:
        ├─ id: "order_IzuyXxokA9g8zN"    ← Order ID
        ├─ entity: "order"
        ├─ amount: 9900                  (paise)
        ├─ amount_paid: 0
        ├─ amount_due: 9900
        ├─ status: "created"
        └─ created_at: 1707998898

7️⃣  Save Order ID in Database
    ├─ subscription.payment.transactionId = order_id
    └─ Save

8️⃣  Return to Frontend
    └─ {
        subscription: {...},        ← Pending subscription object
        razorpayOrder: {
          orderId: "order_xxx",     ← To identify order
          amount: 9900,             ← Amount in paise
          currency: "INR",
          key: "rzp_test_xxx"       ← API key
        }
      }
```

---

## 🎯 PART 2: RAZORPAY MODAL & PAYMENT

### User in Razorpay Checkout Modal

```
╔════════════════════════════════════════════════════════╗
║                RAZORPAY CHECKOUT                      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Order ID:     order_IzuyXxokA9g8zN                   ║
║  Amount:       ₹99                                    ║
║  Description:  Subscribe to Premium Plan             ║
║                                                        ║
║  ┌──────────────────────────────────────────────────┐║
║  │ Card Number: [4111 1111 1111 1111]               ││
║  │ Expiry:      [12/25]        CVV: [123]           ││
║  └──────────────────────────────────────────────────┘║
║                                                        ║
║           [Cancel]  [Pay Now]                        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### What Happens During Payment?

```
User fills card details
        ↓
Razorpay encrypts data
        ↓
Razorpay sends to bank
        ↓
Bank verifies card
        ↓
Bank returns status
        ↓
Razorpay processes response
        ↓
Payment either:
  ✅ CAPTURED (success)
  ❌ FAILED (rejected)
        ↓
Razorpay returns to frontend:
{
  razorpay_payment_id: "pay_IzuyXxokA9g8zN",
  razorpay_order_id: "order_IzuyXxokA9g8zN",
  razorpay_signature: "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

---

## 🔐 PART 3: SIGNATURE VERIFICATION (MOST IMPORTANT)

### Why Is Signature Important?

```
❌ WITHOUT SIGNATURE VERIFICATION (UNSAFE):
┌──────────────────────────────────────────────────────┐
│ Hacker intercepts payment response                  │
│         ↓                                            │
│ Changes: razorpay_payment_id to fake ID             │
│         ↓                                            │
│ Backend doesn't verify, accepts fake payment        │
│         ↓                                            │
│ ❌ SUBSCRIPTION ACTIVATED FOR FREE! 🚨             │
└──────────────────────────────────────────────────────┘

✅ WITH SIGNATURE VERIFICATION (SAFE):
┌──────────────────────────────────────────────────────┐
│ Hacker intercepts payment response                  │
│         ↓                                            │
│ Changes: razorpay_payment_id to fake ID             │
│         ↓                                            │
│ Backend calculates signature based on NEW payment_id │
│         ↓                                            │
│ Calculated signature ≠ Received signature            │
│         ↓                                            │
│ ✅ PAYMENT REJECTED! Hacker failed! ✨            │
└──────────────────────────────────────────────────────┘
```

### How Signature Works (HMAC-SHA256)

```javascript
// Frontend gets from Razorpay:
{
  razorpay_payment_id: "pay_IzuyXxokA9g8zN",
  razorpay_order_id: "order_IzuyXxokA9g8zN",
  razorpay_signature: "9ef4dffb...e0949a3d"      ← This is the HASH
}

// Backend verification process:

// Step 1: Create the body
body = razorpay_order_id + "|" + razorpay_payment_id
body = "order_IzuyXxokA9g8zN|pay_IzuyXxokA9g8zN"

// Step 2: Calculate HMAC-SHA256 using SECRET KEY
calculated_signature = HMAC_SHA256(
  body,
  process.env.RAZORPAY_KEY_SECRET
)

// Step 3: Compare
if (calculated_signature === razorpay_signature) {
  ✅ GENUINE PAYMENT - ACCEPT IT
} else {
  ❌ FAKE PAYMENT - REJECT IT
}

// Why this works:
Hacker doesn't have the SECRET KEY!
Without secret key, can't generate valid signature.
```

### Example Calculation

```
Given:
- razorpay_order_id = "order_IzuyXxokA9g8zN"
- razorpay_payment_id = "pay_IzuyXxokA9g8zN"
- SECRET_KEY = "test_secret_hCRZGIrL"  (from .env)

Step 1: Create body string
body = "order_IzuyXxokA9g8zN|pay_IzuyXxokA9g8zN"

Step 2: Create HMAC
hash = SHA256(body, SECRET_KEY)

Step 3: Convert to hex
signature = "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"

Step 4: Receive signature from Razorpay
received = "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"

Step 5: Compare
hash === received ? ✅ YES : ❌ NO
```

---

## 📲 PART 4: BACKEND VERIFICATION PROCESS

### Complete Verification Flow

```javascript
// POST /api/subscriptions/verify-payment

1️⃣  RECEIVE DATA FROM FRONTEND
    ├─ subscriptionId
    ├─ razorpayPaymentId
    ├─ razorpayOrderId
    └─ razorpaySignature

2️⃣  GET SUBSCRIPTION FROM DATABASE
    ├─ Find subscription by ID
    └─ Check status = "pending"

3️⃣  SECURITY CHECK
    ├─ Is this user's subscription?
    ├─ Verify: subscription.user === req.user._id
    └─ If not match → Return 403 Forbidden

4️⃣  SIGNATURE VERIFICATION (CRITICAL)
    ├─ body = orderId + "|" + paymentId
    ├─ Calculate: HMAC_SHA256(body, SECRET_KEY)
    ├─ Compare with received signature
    │
    └─ If signature invalid:
       └─ Return error "Payment verification failed"

5️⃣  RAZORPAY API CALL (Double Check)
    ├─ Call: razorpay.payments.fetch(paymentId)
    ├─ Razorpay responds with:
    │   ├─ status: "captured"  OR  "authorized"
    │   ├─ amount: 9900
    │   ├─ currency: "INR"
    │   └─ receipt: subscription_id
    │
    └─ If status !== "captured":
       └─ Return error "Payment not captured"

6️⃣  UPDATE SUBSCRIPTION (ACTIVATE!)
    ├─ Set status = "active"              ✅ NOW ACTIVE!
    ├─ Set paymentStatus = "completed"
    ├─ Set paymentDate = Now
    ├─ Set transactionId = paymentId      (Real Razorpay ID)
    └─ Save to database

7️⃣  UPDATE USER
    ├─ Set user.subscription = subscriptionId
    └─ Save to database

8️⃣  RETURN SUCCESS
    └─ {
        message: "Successfully subscribed to Premium Plan!",
        subscription: {...},
        verified: true
      }
```

---

## ✅ PART 5: AFTER PAYMENT

### Database Updates

```javascript
// BEFORE PAYMENT:
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  user: ObjectId("507f1f77bcf86cd799439012"),
  plan: ObjectId("507f1f77bcf86cd799439013"),
  status: "pending",                    // ⚠️ PENDING
  amount: 99,
  payment: {
    paymentStatus: "pending",           // ⚠️ PENDING
    transactionId: "order_IzuyXxokA9g8zN", // Order ID
    paymentDate: null
  },
  startDate: ISODate("2026-04-13T12:00:00Z"),
  endDate: ISODate("2026-05-13T12:00:00Z")
}

// AFTER PAYMENT (ACTIVATED):
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  user: ObjectId("507f1f77bcf86cd799439012"),
  plan: ObjectId("507f1f77bcf86cd799439013"),
  status: "active",                     // ✅ ACTIVE!
  amount: 99,
  payment: {
    paymentStatus: "completed",         // ✅ COMPLETED!
    transactionId: "pay_IzuyXxokA9g8zN", // Real Payment ID
    paymentDate: ISODate("2026-04-13T12:05:30Z")
  },
  startDate: ISODate("2026-04-13T12:00:00Z"),
  endDate: ISODate("2026-05-13T12:00:00Z")
}
```

### What Happens Next?

```
Subscription ACTIVE ✅
        ↓
User goes to /post-job
        ↓
Frontend checks: GET /subscriptions/my-subscription
        ↓
Backend returns active subscription
        ↓
PostJob form loads ✅
        ↓
User can post jobs now! 🎉

BUT IF SUBSCRIPTION EXPIRES:
        ↓
endDate < Today
        ↓
Subscription considered INACTIVE
        ↓
Can't post jobs
        ↓
Must renew subscription ✅
```

---

## 🔄 PART 6: JOB POSTING VALIDATION

### When User Tries to Post Job

```javascript
POST /api/jobs

1️⃣  Check user has active subscription
    ├─ Query: Subscription.findOne({
    │   user: req.user._id,
    │   status: "active",
    │   type: "job-posting",
    │   endDate: { $gte: new Date() }  ← Must be in future
    │ })
    │
    └─ If found → Continue
       If NOT found → Return error "No active subscription"

2️⃣  Check job posting limit
    ├─ Get plan features
    ├─ Get totalJobPostings limit (e.g., 5)
    ├─ Count existing jobs:
    │   Job.countDocuments({
    │     postedBy: req.user._id,
    │     createdAt: { $gte: subscription.startDate }
    │   })
    │
    └─ If count >= limit → Return error "Limit reached"

3️⃣  Validate job data
    ├─ Title required?
    ├─ Description required?
    ├─ Category required?
    └─ Skills required?

4️⃣  Create job
    ├─ Save to database
    └─ Return success

5️⃣  Send notifications
    ├─ Get all job seekers
    ├─ Create notifications
    └─ Send emails
```

---

## 📊 PART 7: PAYMENT FLOW VISUALIZATION

```
TIME AXIS:
0 ms ──────┬──────────────────────────────────────┬─────────────────────
           │                                      │
    User clicks             Backend verifies     Job posting
    "Pay"                   with Razorpay        enabled
                                                  
SUBSCRIPTION STATUS:
0 ms    ────────────────────────┬─────────────────────────────────────
├── pending (awaiting payment)   │ active (payment confirmed)
│                                │
Create order at Razorpay    Payment verified & activated

DATABASE STATE:
{
  0 ms: status = "pending",        paymentStatus = "pending"
  ...
  5 ms: order created at Razorpay
  ...
  100 ms: payment verified
  ...
  102 ms: status = "active",       paymentStatus = "completed"
}
```

---

## 🎓 KEY TAKEAWAYS

1. **Two-Step Process**
   - Create order (subscription pending)
   - Verify payment (subscription active)

2. **Security**
   - Always verify signature on backend
   - Call Razorpay API twice (create & verify)
   - User authorization checks

3. **Database**
   - Subscription created as PENDING initially
   - Only activated after payment verified
   - Real Razorpay payment ID stored

4. **Error Handling**
   - If signature fails → Reject
   - If Razorpay returns error → Reject
   - If payment not captured → Reject
   - Only accept when BOTH checks pass

5. **User Experience**
   - Instant success/failure feedback
   - Automatic redirect to job posting
   - Green banner shows active subscription

---

**Now you understand the COMPLETE payment flow! 🚀**
