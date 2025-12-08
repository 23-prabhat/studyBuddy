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
    match /timerNotes/{noteId} {
      allow read, write: if request.auth != null;
    }
    match /timerLinks/{linkId} {
      allow read, write: if request.auth != null;
    }
    match /timerStates/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
