# Quick Guide: Updating HabitHub

This guide provides a simplified process for making quick updates to the HabitHub application. For more detailed instructions, see the comprehensive [Development Guide](./development-guide.md).

## Common Update Scenarios

### 1. Fixing a Bug

#### Step-by-Step Process
1. **Identify the issue**
   - Check browser console for errors
   - Review GitHub issues for related problems

2. **Locate the relevant code**
   - Use the search function in your code editor
   - Look in the appropriate component file

3. **Make the fix**
   - Update the code to resolve the issue
   - Avoid introducing new bugs

4. **Test your fix**
   - Run `npm start` to start the dev server
   - Verify the bug is fixed in the browser

5. **Deploy the fix**
   - Run `npm run build`
   - Run `firebase deploy`

### 2. Updating Text or Images

#### Updating App Text
1. Find the component containing the text (`src/components/` or `src/pages/`)
2. Change the text within the JSX
3. Save and test locally with `npm start`
4. Build and deploy as above

#### Updating Images
1. Add new images to `src/assets/` or `public/`
2. Reference from components using:
   ```tsx
   // For images in src/assets/
   import myImage from '../assets/myImage.png';
   // ...
   <img src={myImage} alt="Description" />
   
   // For images in public/
   <img src="/myImage.png" alt="Description" />
   ```
3. Test and deploy

### 3. Adding a New Habit Template

1. Open `src/services/firebase-api.ts`
2. Find the function that creates templates (likely `getHabitTemplates()`)
3. Add your new template to the templates array:
   ```tsx
   {
     id: 'unique-template-id',
     title: 'Template Name',
     description: 'Template description',
     frequency: 'daily',
     category: 'health'
   }
   ```
4. Test and deploy

### 4. Changing Colors or Styling

1. For component-specific styling, find the component file and update the Tailwind classes
2. For global theme colors, check `tailwind.config.js` and update the color palette
3. Test across different devices and browsers
4. Build and deploy

## Quick Deployment Steps

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies (if needed)
npm install

# 3. Make your changes to the code

# 4. Test locally
npm start

# 5. Build for production
npm run build

# 6. Deploy to Firebase
firebase deploy
```

## Common Firebase Actions

### Viewing Firestore Data
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Firestore Database" in the left menu
4. Browse collections and documents

### Updating Firestore Security Rules
1. Edit `firestore.rules` in your project
2. Deploy only the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Adding Firebase Admin User
1. Go to Firebase Console > Authentication
2. Click "Add User"
3. Enter email and password

## Monitoring & Maintenance

### Check for Errors
1. Firebase Console > Functions > Logs
2. Browser Console (F12 in Chrome)

### View User Analytics
1. Firebase Console > Analytics

### Monitor Performance
1. Firebase Console > Performance

## Quick Rollback

If an update causes issues:

```bash
# For code issues
git checkout [previous-commit-hash]
npm run build
firebase deploy

# For Firestore rules issues
git checkout [previous-version] firestore.rules
firebase deploy --only firestore:rules
```

## Need More Help?

For more complex updates, refer to the [Development Guide](./development-guide.md) or contact the development team. 