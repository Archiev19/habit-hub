# Firebase Setup Guide

This document provides instructions for setting up Firebase for the HabitHub application.

## Prerequisites

1. A Google account
2. A Firebase project (free tier is sufficient for development)

## Creating a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "habithub")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click "Create project"

## Setting Up Firebase Services

### Authentication

1. In your Firebase project console, navigate to "Authentication"
2. Click "Get started"
3. Enable the "Email/Password" sign-in method
4. Optionally, enable other sign-in methods like Google, Facebook, etc.

### Firestore Database

1. Navigate to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development, test mode is easier)
4. Select a location closest to your users
5. Click "Enable"

### Storage (if needed)

1. Navigate to "Storage"
2. Click "Get started"
3. Accept the default security rules or customize them
4. Click "Next" and then "Done"

## Security Rules

### Firestore Rules

Update your Firestore rules to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.userId ||
                            request.auth.uid == request.resource.data.userId;
    }
    
    match /preferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules (if using Storage)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Adding Firebase to the App

### Install Firebase SDK

```bash
npm install firebase
```

### Configure Firebase

Create a `.env.local` file in the root of your project with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

You can find these values in your Firebase project settings.

## Firebase Emulator (for Development)

Firebase provides local emulators for development purposes:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   Select Firestore, Authentication, and Storage (if needed)

4. Start the emulators:
   ```bash
   firebase emulators:start
   ```

5. Update your Firebase configuration to use the emulators in development mode:

```typescript
// src/config/firebase.ts
if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  // If using storage
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

## Deployment

To deploy your application to Firebase Hosting:

1. Build your application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Data Structure

### Firestore Collections

- **users**: User profiles
  - `id`: User ID (same as Auth UID)
  - `email`: User's email
  - `name`: User's display name
  - `createdAt`: Timestamp when user was created

- **habits**: User habits
  - `id`: Auto-generated habit ID
  - `userId`: User ID who owns this habit
  - `title`: Habit title
  - `description`: Habit description (optional)
  - `frequency`: 'daily' or 'weekly'
  - `completions`: Object mapping dates to boolean completion status
  - `streakCount`: Current streak count
  - `longestStreak`: Longest streak achieved
  - `category`: Habit category (optional)
  - `tags`: Array of tags (optional)
  - `archived`: Whether the habit is archived
  - `goalTarget`: Target count for the habit (optional)
  - `goalPeriod`: 'day', 'week', or 'month' (optional)

- **preferences**: User preferences
  - `id`: User ID (same as Auth UID)
  - `dateFormat`: Preferred date format
  - `firstDayOfWeek`: First day of week preference
  - `timeZone`: User's timezone
  - `emailNotifications`: Whether to send email notifications 