# HabitHub Development Guide: Adding Updates & New Features

This guide provides step-by-step instructions for implementing updates and new features to the HabitHub application.

## Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Understanding the Codebase](#understanding-the-codebase)
- [Adding New Features](#adding-new-features)
- [Modifying Existing Features](#modifying-existing-features)
- [Testing Changes](#testing-changes)
- [Deployment Process](#deployment-process)
- [Common Enhancement Patterns](#common-enhancement-patterns)
- [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites
1. Node.js (v16 or higher)
2. npm or yarn
3. Git
4. Firebase CLI (`npm install -g firebase-tools`)
5. Code editor (VS Code recommended)

### Setting Up Local Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/habit-hub.git
   cd habit-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Set up Firebase emulators (optional but recommended)**
   ```bash
   firebase login
   firebase emulators:start
   ```

## Understanding the Codebase

### Project Structure
HabitHub follows a feature-based structure. Here's a simplified overview:

```
/src
  /assets            # Images, icons, etc.
  /components        # Reusable UI components
    /forms           # Form components
    /habits          # Habit-related components
    /ui              # Generic UI components
  /context           # React context for state management
  /hooks             # Custom React hooks
  /pages             # Page components
  /services          # API and Firebase services
  /types             # TypeScript type definitions
  /utils             # Utility functions
```

### Key Files to Understand
- `src/App.tsx` - Main application component with routing
- `src/context/AuthContext.tsx` - Authentication state management
- `src/services/firebase-api.ts` - Firebase interactions
- `src/components/HabitList.tsx` - Main habit listing
- `src/pages/DashboardPage.tsx` - Main dashboard

## Adding New Features

### Step 1: Plan Your Feature
1. Define the feature requirements
2. Identify UI/UX considerations
3. Determine which components need to be created or modified
4. Consider data model changes if needed

### Step 2: Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Step 3: Implement the Feature

#### Adding a New Component
1. Create a new file in the appropriate directory:
   ```bash
   touch src/components/YourNewComponent.tsx
   ```

2. Implement your component with TypeScript and React:
   ```tsx
   import React from 'react';
   import { useAuth } from '../context/AuthContext';
   
   interface YourNewComponentProps {
     // Define your props here
   }
   
   const YourNewComponent: React.FC<YourNewComponentProps> = (props) => {
     // Implement your component
     return (
       <div>
         {/* Your JSX here */}
       </div>
     );
   };
   
   export default YourNewComponent;
   ```

#### Updating Data Models
1. Update type definitions in `src/types/`:
   ```tsx
   // Example: src/types/habit.ts
   export interface Habit {
     // Existing properties
     id: string;
     title: string;
     // Add your new properties
     yourNewProperty?: string;
   }
   ```

2. Update Firebase service functions in `src/services/firebase-api.ts` if needed:
   ```tsx
   // Add a new function or update existing ones
   export const updateHabitWithNewFeature = async (
     habitId: string, 
     newData: YourNewDataType
   ): Promise<void> => {
     const habitRef = doc(db, 'habits', habitId);
     await updateDoc(habitRef, {
       yourNewProperty: newData.property
     });
   };
   ```

### Step 4: Add the Feature to the UI
1. Import your component where needed:
   ```tsx
   import YourNewComponent from '../components/YourNewComponent';
   ```

2. Add it to the relevant page or parent component:
   ```tsx
   <YourNewComponent prop1={value1} prop2={value2} />
   ```

## Modifying Existing Features

### Step 1: Identify the Components to Modify
Use the codebase search to find relevant components:
```bash
grep -r "ComponentName" src/
```

### Step 2: Make Targeted Changes
1. Update component logic or JSX
2. Ensure you're not breaking existing functionality
3. Update related types if needed

### Step 3: Update Tests
1. Find related tests
2. Update or add new test cases
3. Run tests to verify functionality

## Testing Changes

### Running Local Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/components/YourComponent.test.tsx
```

### Manual Testing Checklist
1. Test on different browsers (Chrome, Firefox, Safari)
2. Test on different devices (desktop, tablet, mobile)
3. Test with different user roles if applicable
4. Test edge cases (empty states, error states, etc.)

## Deployment Process

### Step 1: Merge Your Changes
```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request (from GitHub interface)
# After review, merge to main
```

### Step 2: Build the Application
```bash
npm run build
```

### Step 3: Deploy to Firebase
```bash
firebase deploy
```

For separate staging and production environments:
```bash
# Deploy to staging
firebase deploy -P staging

# Deploy to production
firebase deploy -P production
```

## Common Enhancement Patterns

### Adding a New Page
1. Create a new page component in `src/pages/`
2. Add a new route in `src/App.tsx`:
   ```tsx
   <Route path="/your-new-page" element={<YourNewPage />} />
   ```
3. Add navigation links to the new page

### Adding User Preferences
1. Update the user type definition in `src/types/user.ts`
2. Add UI controls in the settings page
3. Update the Firebase service to save preferences
4. Create or update hooks to use these preferences

### Adding a New Visualization
1. Choose a visualization library (e.g., Recharts, D3.js)
2. Add the library to the project:
   ```bash
   npm install recharts
   ```
3. Create a new component for the visualization
4. Fetch and transform data for the visualization
5. Add the component to a page

## Troubleshooting

### Common Issues and Solutions

#### Firebase Permission Denied
1. Check Firestore security rules in `firestore.rules`
2. Ensure user is authenticated if the rule requires it
3. Verify the user has the correct permissions

#### Component Not Rendering
1. Check for React key errors in the console
2. Verify state and props being passed
3. Check for conditional rendering issues

#### Type Errors
1. Make sure all props have correct types
2. Update interfaces when adding new properties
3. Use optional properties (?) for backward compatibility

### Debug Tools
1. React DevTools for component inspection
2. Firebase Console to check database state
3. Browser developer tools for network and console errors

## Continuous Integration
The project uses GitHub Actions for CI/CD. When you push changes:

1. Tests are automatically run
2. The build is verified
3. Linting is checked
4. If all checks pass, the code can be merged

## Best Practices

1. **Follow existing patterns**: Keep code style consistent with the rest of the codebase
2. **Write tests**: Add tests for new features and fix existing tests if needed
3. **Keep components small**: Split large components into smaller ones
4. **Use TypeScript properly**: Define types for all props and state
5. **Document your code**: Add comments for complex logic
6. **Optimize performance**: Use React.memo, useMemo, and useCallback where appropriate
7. **Consider accessibility**: Ensure features are accessible to all users
8. **Update documentation**: Add or update documentation for significant changes

---

Remember to always back up your data and test thoroughly before deploying to production. Happy coding! 