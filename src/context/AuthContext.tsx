import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Set to false to use real Firebase authentication
const USE_MOCK_DATA = false;

// Define valid mock users for testing
const MOCK_USERS = [
  {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  },
  {
    id: 'user2',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123'
  }
];

const MOCK_USER = MOCK_USERS[0];

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isUserRegistered: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Simulate loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get additional user data from Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUser({
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.displayName || 'User',
                email: firebaseUser.email || ''
              });
            } else {
              // Just use Firebase auth data if Firestore data doesn't exist yet
              setUser({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || ''
              });
            }
          } catch (error) {
            console.error('Error getting user data:', error);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  // Check if a user is registered with the given email
  const isUserRegistered = async (email: string): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        // Check if email exists in mock data
        return MOCK_USERS.some(user => user.email === email);
      } else {
        // Check if user exists in Firebase
        const methods = await fetchSignInMethodsForEmail(auth, email);
        // If user exists, methods will be non-empty
        return methods.length > 0;
      }
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login attempt with:', { email, password: '****' });
      
      if (USE_MOCK_DATA) {
        // Mock login logic
        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (mockUser) {
          setUser({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email
          });
          console.log('Mock login successful');
        } else {
          throw new Error('Invalid email or password');
        }
      } else {
        // Real Firebase login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Get additional user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || 'User',
            email: firebaseUser.email || ''
          });
        } else {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || ''
          });
        }
        console.log('Login successful');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Mock registration logic
        if (MOCK_USERS.some(u => u.email === email)) {
          throw new Error('Email already in use');
        }
        
        // Create a new mock user
        const newMockUser = {
          id: `user${Date.now()}`,
          name,
          email,
          password
        };
        
        // In a real app, we would add to MOCK_USERS, but for this simulation
        // we'll just set the current user
        setUser({
          id: newMockUser.id,
          name: newMockUser.name,
          email: newMockUser.email
        });
        
        console.log('Mock registration successful');
      } else {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Update display name
        await updateProfile(firebaseUser, { displayName: name });
        
        // Store additional user data in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, {
          name,
          email,
          createdAt: new Date().toISOString()
        });
        
        setUser({
          id: firebaseUser.uid,
          name,
          email
        });
        
        console.log('Registration successful');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Just clear the user
        setUser(null);
      } else {
        await signOut(auth);
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, check if user is registered
      const userExists = await isUserRegistered(email);
      
      if (!userExists) {
        throw new Error('No account found with this email address');
      }
      
      if (USE_MOCK_DATA) {
        // Mock password reset
        const mockUser = MOCK_USERS.find(u => u.email === email);
        if (!mockUser) {
          throw new Error('No account found with this email address');
        }
        // Simulate successful reset email
        console.log(`Mock password reset email sent to ${email}`);
      } else {
        // Real Firebase password reset
        await sendPasswordResetEmail(auth, email);
        console.log(`Password reset email sent to ${email}`);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      resetPassword,
      isUserRegistered
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 