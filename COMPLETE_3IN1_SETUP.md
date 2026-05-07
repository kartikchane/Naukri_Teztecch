# Complete Setup Guide: Google OAuth + Razorpay + AWS S3

> **तीनों features के लिए Complete Setup Guide**

---

## 📊 Status Overview

| Feature | Status | Setup Time | Files |
|---------|--------|-----------|-------|
| **Google OAuth** | ✅ Code Complete | 5 min | GOOGLE_OAUTH_SETUP.md |
| **Razorpay Payment** | ✅ Code Complete | 10 min | RAZORPAY_SETUP.md |
| **AWS S3 Storage** | ✅ Code Complete | 15 min | AWS_S3_IMPLEMENTATION.md |

---

## 🔐 1. GOOGLE OAUTH SETUP (5 minutes)

### Kya Kaam Tha:
- ✅ Backend: Google token verification endpoint
- ✅ Frontend: Login/Register में "Continue with Google" button
- ✅ Database: googleId field add kiya

### Setup Karne Ko:

#### Step 1: Google Client ID Banao
```
1. https://console.cloud.google.com/ जाओ
2. "Create Project" करो
3. "OAuth 2.0 credentials" बनाओ (Web Application type)
4. Authorized origins add करो:
   - http://localhost:3000
   - आपका production URL
5. Client ID copy करो
```

#### Step 2: Environment Variables Update
```bash
# frontend/.env
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE

# backend/.env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

#### Step 3: Test करो
```bash
npm run dev (backend)
npm start   (frontend)

# http://localhost:3000/login जाओ
# "Continue with Google" button दिखेगा
```

**Files Modified:**
- `backend/models/User.js` - googleId field
- `backend/routes/auth.js` - /auth/google endpoint
- `frontend/src/pages/Login.js` - Google button
- `frontend/src/pages/Register.js` - Google button
- `frontend/src/App.js` - GoogleOAuthProvider

---

## 💳 2. RAZORPAY SETUP (10 minutes)

### Kya Kaam Tha:
- ✅ Backend: Razorpay payment integration
- ✅ Frontend: Payment form
- ✅ Subscription system with payment verification

### Setup Karne Ko:

#### Step 1: Razorpay Account Banao
```
1. https://razorpay.com/ जाओ
2. Sign up करो (India में)
3. Email verify करो
4. Dashboard > API Keys में जाओ
5. Copy करो:
   - Key ID (RAZORPAY_KEY_ID)
   - Key Secret (RAZORPAY_KEY_SECRET)
```

#### Step 2: Environment Variables Update
```bash
# backend/.env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxxx

# Note: अगर test करना है तो rzp_test_ prefix use करो
# लेकिन production में rzp_live_ use करना
```

#### Step 3: Database में Subscription Model Check करो
```bash
# Subscription model पहले से setup है:
backend/models/Subscription.js
- paymentId
- status (pending, completed, failed)
- amount
- planId
- expiresAt
```

#### Step 4: Payment API Check करो
```bash
POST /api/subscriptions/create-payment
POST /api/subscriptions/verify-payment
GET /api/subscriptions/my-subscription
```

#### Step 5: Test करो
```
1. localhost:3000/plans जाओ
2. "Subscribe" button दबाओ
3. Razorpay payment form खुलेगा
4. Test card use करो:
   - Card: 4111 1111 1111 1111
   - Expiry: 12/25
   - CVV: 123
5. Payment successful होगा
```

**Payment Flow:**
```
Frontend: "Subscribe" button
    ↓
Backend: /create-payment (Razorpay order बनाता है)
    ↓
Frontend: Razorpay modal opens
    ↓
User: Payment करता है
    ↓
Backend: /verify-payment (signature verify करता है)
    ↓
Database: Subscription save होता है
    ↓
User: Premium access मिलता है
```

**Files Modified:**
- `backend/models/Subscription.js` - Subscription model
- `backend/routes/subscriptions.js` - Payment endpoints
- `frontend/src/pages/Plans.js` - Subscription UI
- `backend/package.json` - razorpay library

---

## 🪣 3. AWS S3 SETUP (15 minutes)

### Kya Kaam Tha:
- ✅ Render पर file persistence issue solve किया
- ✅ Local files को AWS S3 में store करना

### क्यों जरूरत है:
```
Render पर server restart होने से सब files delete हो जाते हैं
AWS S3 permanent storage देता है
```

### Setup Karne Ko:

#### Step 1: AWS Account Banao
```
1. https://aws.amazon.com/ जाओ
2. Free tier account बनाओ
3. Verify करो (credit card से)
```

#### Step 2: S3 Bucket Create करो
```
1. AWS Console > S3 जाओ
2. "Create bucket" दबाओ
3. Name दो: naukri-platform-files
4. Region select करो: ap-south-1 (मुंबई)
5. Public access disable रखो
6. Create करो
```

#### Step 3: IAM User Create करो (Access Keys)
```
1. AWS Console > IAM > Users जाओ
2. "Create user" दबाओ
3. Name: naukri-s3-user
4. "Attach existing policy directly" करो
5. Search: "AmazonS3FullAccess" select करो
6. User create करो
7. Click करो > "Create access key"
8. Copy करो:
   - Access Key ID
   - Secret Access Key
```

#### Step 4: Environment Variables Update
```bash
# backend/.env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=naukri-platform-files
AWS_S3_REGION=ap-south-1
```

#### Step 5: Backend Code में S3 Integration Check करो
```bash
# File देखो:
backend/utils/s3Utils.js or similar

# Functions:
- uploadToS3(file, folder)
- getFileUrl(key)
- deleteFromS3(key)
```

#### Step 6: Resume/Document Upload करो
```
1. localhost:3000/profile जाओ (logged in as employer)
2. Resume upload करो
3. File S3 में upload होगी
4. URL database में save होगी
```

**Upload Flow:**
```
Frontend: File select करो
    ↓
Backend: /upload endpoint (multer से)
    ↓
S3Utils: uploadToS3() करो
    ↓
AWS S3: File store होता है
    ↓
Database: S3 URL save होता है
    ↓
Frontend: Preview दिखाता है
```

**Files जो S3 में जाते हैं:**
- Resume files
- Company documents
- Job gallery images
- User avatars
- Application attachments

---

## 🚀 Implementation Order (सब एक साथ)

### Phase 1: Quick Setup (30 minutes)
```
1. Google OAuth:
   - Client ID प्राप्त करो
   - .env files update करो
   - Frontend/Backend restart करो
   - Login page test करो

2. Razorpay:
   - Account बनाओ
   - API Keys copy करो
   - .env update करो
   - /api/subscriptions endpoints check करो

3. AWS S3:
   - S3 bucket बनाओ
   - IAM user + access keys बनाओ
   - .env update करो
   - Upload functionality test करो
```

### Phase 2: Testing (15 minutes)
```
✓ Google login से new user बने
✓ Razorpay से payment work करे
✓ S3 में files upload हो जाएँ
✓ Production URLs काम करें
```

---

## 📋 Complete Checklist

### Google OAuth
- [ ] Google Cloud Project बनाया
- [ ] OAuth 2.0 credentials बनाए
- [ ] Client ID copy किया
- [ ] frontend/.env में डाला
- [ ] backend/.env में डाला
- [ ] Login page test किया
- [ ] Google से sign up test किया

### Razorpay
- [ ] Razorpay account बनाया
- [ ] API Key ID copy किया
- [ ] API Key Secret copy किया
- [ ] backend/.env में डाला
- [ ] /plans page खोला
- [ ] Test card से payment test किया
- [ ] Subscription database में save हुआ

### AWS S3
- [ ] AWS account बनाया
- [ ] S3 bucket बनाया
- [ ] IAM user बनाया
- [ ] Access Key ID copy किया
- [ ] Secret Access Key copy किया
- [ ] backend/.env में सब डाला
- [ ] File upload test किया
- [ ] S3 console में file दिखा

---

## 🔗 Detailed Guide Files

- **Google OAuth**: `GOOGLE_OAUTH_SETUP.md`
- **Razorpay**: `RAZORPAY_SETUP.md`
- **AWS S3**: `AWS_S3_IMPLEMENTATION.md`

---

## 💡 Important Notes

### Security:
```
✓ Kभी भी keys को git में commit न करो
✓ .env file को .gitignore में रखो
✓ Production में अलग keys use करो
✓ S3 bucket को public न करो
```

### Testing:
```
Development:
- Google: सब काम करेगा
- Razorpay: Test mode use करो (rzp_test_)
- S3: Free tier 5GB तक

Production:
- Google: Production Client ID use करो
- Razorpay: Live mode (rzp_live_)
- S3: Paid plan if needed
```

### Troubleshooting:
```
Google OAuth:
- "CORS error" → backend .env में CLIENT_URL check करो
- "Invalid token" → .env में Client ID सही है?

Razorpay:
- "Invalid key" → test/live mode का मिश्रण न करो
- "Payment failed" → test card use करो

AWS S3:
- "Access denied" → IAM user permissions check करो
- "File not uploading" → bucket name और region सही है?
```

---

## ✅ Testing URLs

```bash
# Development URLs
Frontend: http://localhost:3000
Backend API: http://localhost:5001/api

# Test करने के लिए:
1. http://localhost:3000/login        (Google)
2. http://localhost:3000/plans        (Razorpay)
3. http://localhost:3000/profile      (Upload to S3)
```

---

## 📞 समस्या आए तो:

1. **Frontend error** → browser console check करो (F12)
2. **Backend error** → terminal logs देखो
3. **Payment issue** → Razorpay dashboard > Payments
4. **File upload issue** → AWS S3 console > bucket

---

**Ab sab ready hai! Setup करो aur test karo! 🚀**

