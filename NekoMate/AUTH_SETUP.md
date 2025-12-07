# NekoMate - Firebase Authentication Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install firebase
```

### 2. Firebase Setup Complete ✅
- Firebase config is located at: `src/config/firebase.ts`
- Login page created at: `src/Pages/LoginPage.tsx`
- Routes updated in `src/App.tsx`

### 3. Apply Firebase Rules
Follow instructions in `FIREBASE_RULES.md` to set up Firestore and Storage security rules.

## 📱 Features

### Login Page
- ✨ Modern animated UI with gradient backgrounds
- 🔄 Toggle between Login and Sign Up modes
- 📧 Email/Password authentication
- 🔑 Google OAuth sign-in
- 👁️ Show/Hide password toggle
- ⚡ Loading states and error handling
- 📱 Fully responsive design

### Routes
- `/` - Login/Signup page
- `/dashboard` - Main dashboard (protected)
- `/task` - Task management page

## 🔐 Authentication Flow

1. User lands on login page (`/`)
2. Can choose to login or sign up
3. After successful authentication, redirects to `/dashboard`
4. Google sign-in available as alternative

## 🎨 Design Features

- Gradient background with animated blobs
- Smooth transitions and animations
- Tailwind CSS animations (`animate-in`, `fade-in`, etc.)
- Orange accent color matching your theme
- Dark mode optimized

## 🔧 Next Steps

1. **Enable Authentication in Firebase Console:**
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google (configure OAuth)

2. **Apply Security Rules:**
   - See `FIREBASE_RULES.md` for complete rules
   - Apply Firestore rules
   - Apply Storage rules

3. **Add Protected Routes (Optional):**
   ```tsx
   import { Navigate } from 'react-router-dom';
   import { useAuthState } from 'react-firebase-hooks/auth';
   import { auth } from '@/config/firebase';

   function ProtectedRoute({ children }) {
     const [user, loading] = useAuthState(auth);
     
     if (loading) return <div>Loading...</div>;
     if (!user) return <Navigate to="/" />;
     
     return children;
   }
   ```

4. **Add User Profile Management:**
   - Store user data in Firestore
   - Update display name after signup
   - Add profile picture upload

## 📝 Environment Variables (Optional)

For better security, move Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyAP82TYM7Rhs7mBuAAsNj5YBdDOMlZf3wI
VITE_FIREBASE_AUTH_DOMAIN=studybuddy-9af22.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studybuddy-9af22
VITE_FIREBASE_STORAGE_BUCKET=studybuddy-9af22.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1041516127488
VITE_FIREBASE_APP_ID=1:1041516127488:web:4c69c863be8123ab647fe5
VITE_FIREBASE_MEASUREMENT_ID=G-6GGHH2TXPX
```

Then update `src/config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

## 🐛 Common Issues

**Issue:** "Firebase not installed"
**Solution:** Run `npm install firebase`

**Issue:** "Google sign-in not working"
**Solution:** Enable Google provider in Firebase Console and configure OAuth consent screen

**Issue:** Navigation not working
**Solution:** Ensure `react-router-dom` is installed: `npm install react-router-dom`

## 🎯 Test Your Setup

1. Run the dev server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Try signing up with email/password
4. Try logging in
5. Check if redirects to dashboard work
