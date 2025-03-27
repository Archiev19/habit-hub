# Firebase Setup Guide for HabitHub

This guide will walk you through setting up Firebase for your HabitHub application, allowing you to enable user authentication, database, and hosting.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "HabitHub")
4. Choose whether to enable Google Analytics (recommended)
5. Follow the prompts to create your project

## Step 2: Register Your Web App with Firebase

1. On your Firebase project dashboard, click the web icon (</>) to add a web app
2. Provide a nickname for your app (e.g., "HabitHub Web")
3. Check the box for "Also set up Firebase Hosting" if you plan to use it
4. Click "Register app"
5. Firebase will show you configuration details - keep this page open for the next step

## Step 3: Configure Environment Variables

1. Copy the Firebase configuration object (the `firebaseConfig` object)
2. Update your `.env.local` file in the root of your project with these values:

```
VITE_FIREBASE_API_KEY=your_api_key_from_firebase
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Update `.env.production` with the same values for production deployment

## Step 4: Enable Authentication

1. In the Firebase Console, navigate to "Authentication" in the left sidebar
2. Click "Get started"
3. Select "Email/Password" as your authentication provider
4. Toggle the "Enable" switch to ON
5. Click "Save"

## Step 5: Set Up Firestore Database

1. In the Firebase Console, navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose either "Start in production mode" or "Start in test mode" (for development, test mode is easier, but less secure)
4. Select a location for your database (choose the one closest to your users)
5. Click "Enable"

## Step 6: Set Up Security Rules

1. In the Firestore Database section, go to the "Rules" tab
2. Update the rules to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habits
    match /habits/{habitId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Preferences
    match /preferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Initialize Firebase in Your Local Project

1. Make sure your project has the Firebase SDK installed:
   ```bash
   npm install firebase
   ```

2. If you want to use Firebase locally with emulators:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

3. Choose the services you want to use (Firestore, Authentication, Hosting)
4. Select your Firebase project
5. Follow the prompts to configure each service

## Step 8: Deploy to Firebase Hosting (Optional)

1. Make sure you've initialized Firebase in your project (Step 7)
2. Build your project:
   ```bash
   npm run build
   ```

3. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

## Testing Your Firebase Integration

After completing the setup, test your application:

1. Start your development server:
   ```bash
   npm start
   ```

2. Try to sign up for a new account
3. Check if the user data is stored in Firestore
4. Test login functionality
5. Create, read, update, and delete habits to verify database operations

## Troubleshooting

If you encounter issues:

1. **Authentication errors**: 
   - Make sure your environment variables are correct
   - Confirm Email/Password authentication is enabled in Firebase

2. **Database errors**:
   - Check your Firestore rules
   - Verify your database was created properly

3. **General Firebase errors**:
   - Check the browser console for error messages
   - Ensure all Firebase SDKs are properly installed

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase JavaScript SDK Reference](https://firebase.google.com/docs/reference/js)

## Next Steps

After setting up Firebase:

1. Consider adding more authentication methods (Google, Facebook, etc.)
2. Set up Firebase Storage for user profile images
3. Implement Firebase Cloud Functions for server-side logic
4. Configure Firebase Analytics to track user behavior 