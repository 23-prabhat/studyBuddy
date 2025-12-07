# Updated Firebase Firestore Rules

## Copy and paste this in Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // USERS collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }

    // TASKS collection
    match /tasks/{taskId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // NOTES collection
    match /notes/{noteId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // STUDY SESSIONS collection
    match /studySessions/{sessionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Create Required Indexes

**Method 1: Automatic (Recommended)**
1. Try creating a task again
2. Check browser console (F12)
3. You'll see an error with a link like: `https://console.firebase.google.com/...`
4. Click that link to automatically create the index
5. Wait 1-2 minutes for the index to build

**Method 2: Manual**
1. Go to Firebase Console → Firestore Database → Indexes tab
2. Click "Create Index"
3. Add these indexes:

### Index 1: Tasks by userId and createdAt
- Collection ID: `tasks`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

### Index 2: Tasks by userId, completed, and createdAt
- Collection ID: `tasks`
- Fields:
  - `userId` (Ascending)
  - `completed` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

### Index 3: Study Sessions by userId and startTime
- Collection ID: `studySessions`
- Fields:
  - `userId` (Ascending)
  - `startTime` (Descending)
- Query scope: Collection

After creating indexes, wait 1-2 minutes for them to build before testing again.
