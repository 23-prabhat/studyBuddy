# Firebase Security Rules Setup

## ⚠️ IMPORTANT: Fix "operation-not-allowed" Error

**Before applying rules below, you MUST enable authentication methods in Firebase Console:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **studybuddy-9af22**
3. Click **Authentication** in left sidebar
4. Click **Sign-in method** tab
5. Click **Email/Password** → Toggle **Enable** → Save
6. Click **Google** → Toggle **Enable** → Configure OAuth → Save

---

## 📝 Firestore Database Rules

**Copy the code below and paste it in:**  
Firebase Console → **Firestore Database** → **Rules** tab → Paste → **Publish**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    match /notes/{noteId} {
      allow read, write: if request.auth != null;
    }
    match /studySessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📦 Firebase Storage Rules

**Copy the code below and paste it in:**  
Firebase Console → **Storage** → **Rules** tab → Paste → **Publish**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/profile/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId && request.resource.contentType.matches('image/.*') && request.resource.size < 5 * 1024 * 1024;
    }
    match /users/{userId}/documents/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## ℹ️ Why Two Separate Rules?

**Firestore** = Database for storing text data (users, tasks, notes)  
**Storage** = File storage for images, documents, PDFs

They are different Firebase services and require separate security rules.
