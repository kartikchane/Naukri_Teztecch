# Google OAuth Setup Guide

## ✅ Implementation Complete!

I've successfully added "Continue with Google" functionality to your Naukri job portal. Here's what was implemented:

### Changes Made:

#### Backend:
1. ✅ Added `google-auth-library` dependency
2. ✅ Updated `User` model to include:
   - `googleId` field (for linking Google accounts)
   - `provider` field (tracks if user registered via 'local' or 'google')
   - Made password optional (Google OAuth users don't need passwords)
3. ✅ Added new endpoint: `POST /api/auth/google`
   - Verifies Google ID tokens
   - Handles new user registration via Google
   - Links Google accounts to existing email accounts
   - Returns JWT token for authentication

#### Frontend:
1. ✅ Added `@react-oauth/google` dependency
2. ✅ Wrapped app with `GoogleOAuthProvider` in App.js
3. ✅ Added `loginWithGoogle()` method to AuthContext
4. ✅ Added "Continue with Google" button to Login.js
5. ✅ Added "Continue with Google" button to Register.js
6. ✅ Updated environment files with placeholder for Google Client ID

---

## 🔧 Setup Steps (5 minutes):

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name (e.g., "Naukri Job Portal")
4. Click "Create"

### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. You may need to configure the OAuth consent screen first:
   - Click "Configure Consent Screen"
   - Select "External"
   - Fill in app name: "Naukri Job Portal"
   - Add your email
   - Skip optional scopes
   - Add test users (your email)
   - Save and continue

### Step 3: Create Web Application Credentials
After configuring consent screen:
1. Go back to "Credentials" → "Create Credentials" → "OAuth client ID"
2. Select "Web application"
3. Name it: "Naukri Web App"
4. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (development)
   - `http://localhost:5000` (if frontend on different port)
   - Your production frontend URL (when ready)

5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/login`
   - `http://localhost:3000/register`
   - Your production URLs (when ready)

6. Click "Create"
7. Copy your **Client ID** (looks like: `xxx-xxx-xxx.apps.googleusercontent.com`)

### Step 4: Add Client ID to Environment Files

#### Frontend (.env):
```bash
# File: frontend/.env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_GOOGLE_CLIENT_ID=YOUR_COPIED_CLIENT_ID_HERE
```

#### Backend (.env):
```bash
# File: backend/.env
GOOGLE_CLIENT_ID=YOUR_COPIED_CLIENT_ID_HERE
```

### Step 5: Restart Your Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 🧪 Testing the Implementation:

### Test Login with Google:
1. Go to `http://localhost:3000/login`
2. Click "Continue with Google" button
3. You should see a Google login popup
4. Sign in with your Google account
5. You should be redirected to home page as logged-in user

### Test Sign Up with Google:
1. Go to `http://localhost:3000/register`
2. Select your role (Job Seeker or Employer)
3. Click "Continue with Google" button
4. Follow the login flow
5. New account should be created with your Google profile data

### Test Linking Existing Account:
1. Create account with email/password
2. Try logging in with the same email via Google
3. Account should be linked automatically

### Verify in Database:
Check MongoDB to see the new fields:
```
{
  "_id": ObjectId(...),
  "name": "John Doe",
  "email": "john@gmail.com",
  "googleId": "118206xxx",
  "provider": "google",
  "role": "jobseeker",
  "avatar": "https://lh3.googleusercontent.com/...",
  // ... other fields
}
```

---

## 📝 Key Features:

✅ **Secure Token Verification**: Google tokens are verified on the backend  
✅ **Email Linking**: If a user signs up with Google using an existing email, accounts are linked  
✅ **Role Selection**: Users can choose their role (jobseeker/employer) on signup  
✅ **Profile Data**: Name, email, and avatar are auto-filled from Google profile  
✅ **Backward Compatible**: Regular email/password login still works perfectly  
✅ **Account Linking**: Users can use both Google and email/password to login to same account  

---

## 🚀 Production Deployment:

When deploying to production:

1. **Get Production Client ID**:
   - In Google Cloud Console, add your production frontend URL to Authorized origins
   - Add production redirect URIs

2. **Update Environment Variables**:
   ```bash
   # Production .env
   REACT_APP_GOOGLE_CLIENT_ID=your_production_client_id
   GOOGLE_CLIENT_ID=your_production_client_id
   ```

3. **Security**: 
   - Keep Client IDs in environment variables (not in code)
   - Client ID can be public (it's for frontend)
   - Only use production Client ID in production builds

---

## 🐛 Troubleshooting:

### "Google button not showing"
- Ensure `REACT_APP_GOOGLE_CLIENT_ID` is set in frontend/.env
- Restart frontend server after changing .env
- Check browser console for errors

### "Invalid Client ID" error
- Verify Client ID is correctly copied
- Check it matches in both frontend and backend .env
- Ensure Client ID is from Web application, not other type

### "CORS error"
- Make sure backend has correct CORS configuration
- Check that `CLIENT_URL` in backend .env matches frontend URL

### "Token verification failed"
- Verify `GOOGLE_CLIENT_ID` in backend .env is correct
- Check backend is restarted
- Ensure token is being sent in request

---

## 📚 Files Modified:

1. `backend/package.json` - Added google-auth-library
2. `backend/models/User.js` - Added googleId, provider fields
3. `backend/routes/auth.js` - Added /auth/google endpoint
4. `frontend/package.json` - Added @react-oauth/google
5. `frontend/src/App.js` - Added GoogleOAuthProvider wrapper
6. `frontend/src/context/AuthContext.js` - Added loginWithGoogle method
7. `frontend/src/pages/Login.js` - Added Google button
8. `frontend/src/pages/Register.js` - Added Google button
9. `frontend/.env` - Added REACT_APP_GOOGLE_CLIENT_ID
10. `backend/.env` - Added GOOGLE_CLIENT_ID

---

## 🎯 Next Steps:

1. Copy your Google Client ID
2. Update both .env files
3. Restart servers
4. Test the login/signup flow
5. Deploy to production when ready

Enjoy your new Google OAuth feature! 🎉

