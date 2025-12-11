rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Tasks/Todos collection
    match /tasks/{taskId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
    }
    
    // Study sessions collection
    match /studySessions/{sessionId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
    }
    
    // Timer notes collection
    match /timerNotes/{noteId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
    }
    
    // Timer links collection
    match /timerLinks/{linkId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
    }
    
    // Timer states collection
    match /timerStates/{stateId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
    }
    
    // Notes collection (dashboard notes)
    match /notes/{noteId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
    }
    
    // Calendar events collection
    match /calendarEvents/{eventId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow create: if isAuthenticated() && (
        request.resource.data.userId == request.auth.uid
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid
      );
    }
  }
}
