# Firebase Setup and Index Management Guide

## Initial Setup

If you haven't already initialized Firebase in your project, run:

```bash
firebase login
firebase init
```

Select **Firestore** when prompted.

## Deploying Firestore Indexes

All your composite indexes are now defined in `firestore.indexes.json`. To deploy them:

```bash
firebase deploy --only firestore:indexes
```

This will create all the indexes at once without needing to create them manually each time.

## Deploying Firestore Security Rules

To deploy your security rules:

```bash
firebase deploy --only firestore:rules
```

## Deploy Everything at Once

To deploy both indexes and rules together:

```bash
firebase deploy --only firestore
```

## What Indexes Are Included?

Your `firestore.indexes.json` includes composite indexes for:

### 1. **Todos Collection**
- `userId` + `createdAt` (DESC) - For fetching user's todos sorted by creation date
- `userId` + `completed` + `createdAt` (DESC) - For filtering completed/active todos

### 2. **Study Sessions Collection**
- `userId` + `startTime` (DESC) - For fetching sessions sorted by start time
- `userId` + `endTime` (DESC) - For fetching sessions sorted by end time

### 3. **Timer Notes Collection**
- `userId` + `createdAt` (DESC) - For fetching user's timer notes

### 4. **Timer Links Collection**
- `userId` + `createdAt` (DESC) - For fetching user's timer YouTube links

### 5. **Notes Collection**
- `userId` + `updatedAt` (DESC) - For fetching dashboard notes

## Adding New Indexes

If you need to add a new index in the future:

1. Open `firestore.indexes.json`
2. Add a new index object to the `indexes` array:

```json
{
  "collectionGroup": "yourCollection",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "userId",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "fieldName",
      "order": "DESCENDING"
    }
  ]
}
```

3. Deploy: `firebase deploy --only firestore:indexes`

## Troubleshooting

### If you get an index error while running your app:

1. Firestore will provide a direct link to create the index in the console
2. **OR** Add the index definition to `firestore.indexes.json` and deploy

### Check index build status:

Visit the [Firebase Console](https://console.firebase.google.com/) → Your Project → Firestore Database → Indexes tab

### Delete unused indexes:

Remove the index definition from `firestore.indexes.json` and run:
```bash
firebase deploy --only firestore:indexes
```

Then manually delete from Firebase Console (automatic deletion isn't supported via CLI).

## Best Practices

✅ **Always version control** `firestore.indexes.json` and `firestore.rules`  
✅ **Test locally** using the Firebase Emulator Suite  
✅ **Deploy indexes** before deploying new app features that require them  
✅ **Monitor index usage** in Firebase Console to optimize performance  

## Useful Commands

```bash
# View current project
firebase projects:list

# Switch project
firebase use <project-id>

# View deployment status
firebase deploy --only firestore --dry-run

# Start local emulator (optional, for testing)
firebase emulators:start
```

---

**Now you're all set!** 🎉 You won't need to manually create indexes every time. Just update `firestore.indexes.json` and deploy!
