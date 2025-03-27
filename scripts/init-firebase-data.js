/**
 * This script initializes Firebase with sample data for testing.
 * Run with: node scripts/init-firebase-data.js
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp,
  getDocs,
  query,
  where
} = require('firebase/firestore');
const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile
} = require('firebase/auth');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123',
  name: 'Test User'
};

// Sample habits data
const sampleHabits = [
  {
    title: 'Morning Exercise',
    description: 'Do 15 minutes of exercise every morning',
    frequency: 'daily',
    completions: {
      // Set some sample completions for the last few days
      [new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    },
    archived: false,
    goalTarget: 5,
    goalPeriod: 'week',
    category: 'Fitness',
    tags: ['health', 'morning-routine', 'exercise']
  },
  {
    title: 'Read a Book',
    description: 'Read at least 10 pages of a book',
    frequency: 'daily',
    completions: {
      [new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    },
    archived: false,
    goalTarget: 1,
    goalPeriod: 'day',
    category: 'Learning',
    tags: ['reading', 'personal-development']
  },
  {
    title: 'Weekly Review',
    description: 'Review goals and progress for the week',
    frequency: 'weekly',
    completions: {
      [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    },
    archived: false,
    goalTarget: 1,
    goalPeriod: 'week',
    category: 'Productivity',
    tags: ['planning', 'reflection']
  },
  {
    title: 'Meditation Practice',
    description: 'Practice meditation for 10 minutes',
    frequency: 'daily',
    completions: {
      [new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    },
    archived: true,
    goalTarget: 3,
    goalPeriod: 'week',
    category: 'Mindfulness',
    tags: ['mental-health', 'wellness']
  }
];

// Create a test user and add sample habits
async function initializeFirebaseData() {
  try {
    console.log('Initializing Firebase with sample data...');
    
    // Check if the test user already exists
    const usersQuery = query(collection(db, 'users'), where('email', '==', testUser.email));
    const userSnapshot = await getDocs(usersQuery);
    
    let userId;
    
    if (userSnapshot.empty) {
      console.log('Creating test user...');
      
      // Create the test user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, testUser.email, testUser.password);
      await updateProfile(userCredential.user, { displayName: testUser.name });
      
      userId = userCredential.user.uid;
      
      // Add user data to Firestore
      await setDoc(doc(db, 'users', userId), {
        name: testUser.name,
        email: testUser.email,
        createdAt: serverTimestamp()
      });
      
      console.log(`Test user created with ID: ${userId}`);
    } else {
      console.log('Test user already exists, using existing user');
      userId = userSnapshot.docs[0].id;
    }
    
    // Get existing habits for the user
    const habitsQuery = query(collection(db, 'habits'), where('userId', '==', userId));
    const habitsSnapshot = await getDocs(habitsQuery);
    
    if (habitsSnapshot.empty) {
      console.log('Adding sample habits...');
      
      // Add sample habits to Firestore
      for (const habit of sampleHabits) {
        const habitData = {
          ...habit,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'habits'), habitData);
        console.log(`Added habit: ${habit.title} with ID: ${docRef.id}`);
      }
      
      console.log('Sample habits added successfully');
    } else {
      console.log('User already has habits, skipping sample habit creation');
    }
    
    console.log('\nFirebase initialization complete!');
    console.log('You can now log in with:');
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
}

// Run the initialization
initializeFirebaseData(); 